import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

import type { Listing, ListingFactory, NeftieCore } from "../typechain";
import { contracts } from "./helpers";

enum OrderStatus {
  PLACED,
  DISMISSED,
  ONGOING,
  CANCELLED,
  DELIVERED,
  COMPLETED,
}

describe("Listing", () => {
  let listingFactory: ListingFactory;
  let listingImpl: Listing;
  let core: NeftieCore;
  let listing: Listing;

  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user: SignerWithAddress;
  let client: SignerWithAddress;
  let moderator: SignerWithAddress;

  const price = ethers.utils.parseEther("1.5");
  const bondFee = ethers.utils.parseEther("0.02");
  const deliveryDays = BigNumber.from(4);
  const revisions = BigNumber.from(3);
  const _nonce = 123;
  const getListingParams = (
    nonce = _nonce
  ): Parameters<ListingFactory["createListing"]> => [
    "Test title",
    price,
    bondFee,
    deliveryDays,
    revisions,
    nonce,
  ];

  beforeEach(async () => {
    ({
      listingFactory,
      listingImpl,
      core,
      signers: { owner, admin, user, moderator, client },
    } = await contracts.deployAll());

    listing = listingImpl.attach(
      (
        await contracts.createListing({
          listingFactory,
          user,
          params: getListingParams(),
        })
      ).address
    );

    // tests are broken with typechain
    (listing as any).getAddress = () => listing.address;
    (core as any).getAddress = () => core.address;
  });

  describe("initialization", () => {
    it("should have the listingFactory set", async () => {
      expect(await listing.listingFactory()).to.eq(listingFactory.address);
    });

    it("should prevent initializing more than once", async () => {
      await expect(
        listing.initialize(user.address, "Test", 1000, 100, 7, 3)
      ).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("should set the data on initialization", async () => {
      expect(await listing.seller()).to.eq(user.address);

      const data = await listing.listing();

      expect([
        data.title,
        data.price,
        data.bondFee,
        data.deliveryDays.div(24).div(60).div(60).toNumber(),
        data.revisions.toNumber(),
      ]).to.have.deep.members(
        getListingParams()
          .map((e, i) =>
            BigNumber.isBigNumber(e) && ![1, 2].includes(i) ? e.toNumber() : e
          )
          .slice(0, -1)
      );
    });

    it("should validate data", async () => {
      await expect(
        listingFactory.createListing("", 100, 1, 3, 3, 3)
      ).to.be.revertedWith("Title is required");
      await expect(
        listingFactory.createListing("Test", 0, 1, 3, 3, 3)
      ).to.be.revertedWith("Price is required");
      await expect(
        listingFactory.createListing("Test", 100, 200, 3, 3, 3)
      ).to.be.revertedWith("Bond fee cannot be higher than price");
      await expect(
        listingFactory.createListing("Test", 100, 1, 40, 3, 3)
      ).to.be.revertedWith("Invalid delivery days");
    });
  });

  describe("order lifecycle", () => {
    let orderId: string;

    beforeEach(async () => {
      const rc = await (
        await listing.connect(client).placeOrder({
          value: price.add(bondFee),
        })
      ).wait();
      const event = rc.events!.find((e) => e.event === "OrderPlaced")!;
      ({ orderId } = event.args!);
    });

    describe("place order", () => {
      const tx = (value = price.add(bondFee), u = client) =>
        listing.connect(u).placeOrder({
          value,
        });

      it("should allow placing an order", async () => {
        expect(await listing.lastOrderCount()).to.eq(1);
        expect((await listing.orders(orderId)).client).to.eq(client.address);
        await expect(await tx()).to.changeEtherBalances(
          [listing, client],
          [price.add(bondFee), price.add(bondFee).mul(-1)]
        );
      });

      it("should emit the OrderPlaced event", async () => {
        const rc = await (await tx()).wait();
        const event = rc.events!.find((e) => e.event === "OrderPlaced")!;
        expect(event.args).to.contain.keys(["orderId", "client"]);
      });

      it("should send the client any surplus", async () => {
        await expect(
          await tx(price.add(bondFee).add(100))
        ).to.changeEtherBalances(
          [listing, client],
          [price.add(bondFee), price.add(bondFee).mul(-1)]
        );
      });

      it("should not allow seller to place an own order", async () => {
        await expect(tx(price.add(bondFee), user)).to.be.revertedWith(
          "A seller cannot place an order in its own listing"
        );
      });

      it("should validate the amount sent", async () => {
        await expect(tx(price)).to.be.revertedWith(
          "Value must match listing price + bond fee"
        );
      });
    });

    describe("approve order", () => {
      it("should allow the seller to approve an order", async () => {
        await listing.connect(user).approveOrder(orderId);
        expect((await listing.orders(orderId)).status).to.eq(
          OrderStatus.ONGOING
        );
      });

      it("should not allow the client to approve an order", async () => {
        await expect(
          listing.connect(client).approveOrder(orderId)
        ).to.be.revertedWith("Only seller");
      });

      it("should only allow approving an order in status PLACED", async () => {
        await listing.connect(user).approveOrder(orderId);
        await expect(
          listing.connect(user).approveOrder(orderId)
        ).to.be.revertedWith("Not allowed by order status");
      });

      it("should emit the OrderApproved event", () => {
        expect(listing.connect(user).approveOrder(orderId))
          .to.emit(listing, "OrderApproved")
          .withArgs(orderId);
      });
    });

    describe("dismiss order", () => {
      it("should allow the seller to dismiss an order", async () => {
        await listing.connect(user).dismissOrder(orderId);
        expect((await listing.orders(orderId)).status).to.eq(
          OrderStatus.DISMISSED
        );
      });

      it("should allow the client to dismiss an order", async () => {
        await listing.connect(client).dismissOrder(orderId);
        expect((await listing.orders(orderId)).status).to.eq(
          OrderStatus.DISMISSED
        );
      });

      it("should refund the client the price + bond fee", async () => {
        const value = price.add(bondFee);
        await expect(
          await listing.connect(client).dismissOrder(orderId)
        ).to.changeEtherBalances([listing, client], [value.mul(-1), value]);
      });

      it("should emit the OrderDismissed event", async () => {
        await expect(listing.connect(client).dismissOrder(orderId))
          .to.emit(listing, "OrderDismissed")
          .withArgs(orderId, client.address);
      });

      it("should only allow dismissing an order in status PLACED", async () => {
        await listing.connect(user).dismissOrder(orderId);
        await expect(
          listing.connect(user).dismissOrder(orderId)
        ).to.be.revertedWith("Not allowed by order status");
      });
    });

    describe("cancel order", () => {
      beforeEach(async () => {
        await listing.connect(user).approveOrder(orderId);
      });

      it("should allow the seller to cancel an order", async () => {
        const tx = await listing.connect(user).cancelOrder(orderId);
        const value = price.add(bondFee);

        expect((await listing.orders(orderId)).status).to.eq(
          OrderStatus.CANCELLED
        );
        expect(tx).to.changeEtherBalances(
          [listing, client],
          [value.mul(-1), value]
        );
      });

      it("should allow the client to cancel an order", async () => {
        const tx = await listing.connect(client).cancelOrder(orderId);
        expect((await listing.orders(orderId)).status).to.eq(
          OrderStatus.CANCELLED
        );

        const penalty = price.mul(10).div(100);
        await expect(tx).to.changeEtherBalances(
          [listing, client, user, core],
          [price.add(bondFee).mul(-1), price.sub(penalty), bondFee, penalty]
        );
      });

      it("should emit the OrderCancelled event", async () => {
        await expect(listing.connect(user).cancelOrder(orderId)).to.emit(
          listing,
          "OrderCancelled"
        );
        // @todo how to "guess" the timestamp?
        // .withArgs(orderId, user.address, "165");
      });

      it("should refund the client if the order is past due", async () => {
        await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 5]);
        await ethers.provider.send("evm_mine", []);

        const tx = await listing.connect(client).cancelOrder(orderId);
        const value = price.add(bondFee);
        await expect(tx).to.changeEtherBalances(
          [listing, client],
          [value.mul(-1), value]
        );
      });

      it("should only allow cancelling an order in status ONGOING", async () => {
        await listing.connect(client).cancelOrder(orderId);
        await expect(
          listing.connect(client).cancelOrder(orderId)
        ).to.be.revertedWith("Not allowed by order status");
      });
    });

    describe("deliver order", () => {
      beforeEach(async () => {
        await listing.connect(user).approveOrder(orderId);
      });

      it("should allow the seller to deliver an order", async () => {
        await expect(
          listing.connect(client).deliverOrder(orderId)
        ).to.be.revertedWith("Only seller");

        await listing.connect(user).deliverOrder(orderId);

        const order = await listing.orders(orderId);
        expect(order.status).to.eq(OrderStatus.DELIVERED);
      });

      it("should only allow delivering an order in status ONGOING", async () => {
        await listing.connect(user).deliverOrder(orderId);
        await expect(
          listing.connect(user).deliverOrder(orderId)
        ).to.be.revertedWith("Not allowed by order status");
      });

      it("should emit the OrderDelivered event", async () => {
        await expect(listing.connect(user).deliverOrder(orderId)).to.emit(
          listing,
          "OrderDelivered"
        );
        // @todo how to "guess" the timestamp?
        // .withArgs(orderId, "165");
      });
    });

    describe("post order delivery", () => {
      beforeEach(async () => {
        await listing.connect(user).approveOrder(orderId);
        await listing.connect(user).deliverOrder(orderId);
      });

      it("should allow the client to request a revision", async () => {
        await expect(
          listing.connect(user).requestRevision(orderId)
        ).to.be.revertedWith("Only client");

        await listing.connect(client).requestRevision(orderId);

        const order = await listing.orders(orderId);
        expect(order.underRevision).to.eq(true);
        expect(order.status).to.eq(OrderStatus.ONGOING);
        expect(order.revisionsLeft).to.eq(revisions.sub(1));
      });

      it("should emit the RevisionRequested event", async () => {
        await expect(listing.connect(client).requestRevision(orderId))
          .to.emit(listing, "RevisionRequested")
          .withArgs(orderId);
      });

      it("should only allow requesting a revision in status DELIVERED", async () => {
        await listing.connect(client).requestRevision(orderId);
        await expect(
          listing.connect(client).requestRevision(orderId)
        ).to.be.revertedWith("Not allowed by order status");
      });

      it("should not allow requesting a revision if there are none left", async () => {
        for (const ignore of new Array(revisions.toNumber()).fill(null)) {
          await listing.connect(client).requestRevision(orderId);
          await listing.connect(user).deliverOrder(orderId);
        }

        await expect(
          listing.connect(client).requestRevision(orderId)
        ).to.be.revertedWith("No revisions left");
      });

      it("should only allow requesting a revision if the timespan has not passed", async () => {
        await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 5]);
        await ethers.provider.send("evm_mine", []);

        await expect(
          listing.connect(client).requestRevision(orderId)
        ).to.be.revertedWith("Revision timespan has passed");
      });

      it("should allow the client to send a tip", async () => {
        const tip = ethers.utils.parseEther("0.2");
        const tx = (u = client, value = tip) =>
          listing.connect(u).tipSeller(orderId, { value });

        await expect(tx(user)).to.be.revertedWith("Only client");

        const cut = tip.mul(5).div(100);

        await expect(await tx()).to.changeEtherBalances(
          [listing, client, core],
          [tip.sub(cut), tip.mul(-1), cut]
        );
        expect((await listing.orders(orderId)).tips).to.eq(tip.sub(cut));
      });

      it("should emit the Tip event", async () => {
        await expect(
          listing.connect(client).tipSeller(orderId, { value: 1000 })
        )
          .to.emit(listing, "Tip")
          .withArgs(orderId, BigNumber.from(1000));
      });

      it("should not allow zero-amount tips", async () => {
        await expect(
          listing.connect(client).tipSeller(orderId)
        ).to.be.revertedWith("Tip must be greater than 0");
      });
    });
  });
});
