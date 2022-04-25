import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Listing, ListingFactory, NeftieCore } from "../typechain";
import { contracts } from "./helpers";

describe("ListingFactory", () => {
  let listingFactory: ListingFactory;
  let listingImpl: Listing;
  let core: NeftieCore;
  let originalCore: NeftieCore;

  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user: SignerWithAddress;
  let moderator: SignerWithAddress;

  const price = ethers.utils.parseEther("1.5");
  const bondFee = ethers.utils.parseEther("0.02");
  const deliveryDays = 4;
  const revisions = 3;

  beforeEach(async () => {
    ({
      listingFactory,
      listingImpl,
      core,
      signers: { owner, admin, user, moderator },
    } = await contracts.deployAll());

    originalCore = core;
  });

  describe("roles", () => {
    const tx = (u = admin, c = core.address) =>
      listingFactory.connect(u).updateCoreContract(c);

    beforeEach(async () => {
      core = await contracts.deployCore({ admin, owner, moderator });
    });

    it("should assign the roles contract on creation", async () => {
      expect(await listingFactory.coreContract()).to.eq(originalCore.address);
    });

    it("should allow admins to update the roles contract", async () => {
      await tx();

      expect(await listingFactory.coreContract()).to.eq(core.address);
      await expect(tx(user)).to.be.revertedWith("Only admin");
    });

    it("should not allow updating the roles contract to a non-contract addresses", async () => {
      await expect(tx(admin, ethers.constants.AddressZero)).to.be.revertedWith(
        "Address is not a contract"
      );
    });

    it("should emit the CoreContractUpdated event", async () => {
      await expect(tx())
        .to.emit(listingFactory, "CoreContractUpdated")
        .withArgs(core.address);
    });
  });

  describe("listings", () => {
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

    const tx = () =>
      listingFactory.connect(user).createListing(...getListingParams());

    it("should allow the creation of a listing", async () => {
      const { address } = await contracts.createListing({
        listingFactory,
        user,
        params: getListingParams(),
      });

      expect(address).to.be.properAddress;

      const listing = listingImpl.attach(address);
      expect(await listing.seller()).to.eq(user.address);
    });

    it("should not allow creating a listing for the same seller + nonce", async () => {
      await tx();
      await expect(tx()).to.be.revertedWith("ERC1167: create2 failed");
    });

    it("should predict the correct address for a listing", async () => {
      await tx();
      const address = await listingFactory.predictListingAddress(
        user.address,
        _nonce
      );

      expect(address).to.be.properAddress;

      const listing = listingImpl.attach(address);
      expect(await listing.seller()).to.eq(user.address);
    });

    it("should emit the ListingCreated event", async () => {
      await expect(tx())
        .to.emit(listingFactory, "ListingCreated")
        .withArgs(
          await listingFactory.predictListingAddress(user.address, _nonce),
          user.address,
          ...getListingParams()
        );
    });
  });

  describe("implementation", () => {
    let newListingImpl: Listing;

    beforeEach(async () => {
      newListingImpl = await contracts.deployListingImpl({
        owner,
        listingFactory,
      });
    });

    it("should allow admins to update the implementation contract", async () => {
      expect(await listingFactory.implementation()).to.eq(listingImpl.address);
      expect(await listingFactory.implementationVersion()).to.eq(1);

      await expect(
        listingFactory
          .connect(user)
          .updateImplementationContract(newListingImpl.address)
      ).to.be.revertedWith("Only admin");
    });

    it("should not allow updating the implementation contract to non-contract addresses", async () => {
      await expect(
        listingFactory
          .connect(admin)
          .updateImplementationContract(admin.address)
      ).to.be.revertedWith("Address is not a contract");
    });

    it("should correctly version the implementation contract", async () => {
      await listingFactory
        .connect(admin)
        .updateImplementationContract(newListingImpl.address);

      expect(await listingFactory.implementation()).to.eq(
        newListingImpl.address
      );
      expect(await listingFactory.implementationVersion()).to.eq(2);
    });

    it("should initialize the implementation contract", async () => {
      await expect(
        listingImpl.initialize(user.address, "Test", 1000, 100, 3, 3)
      ).to.be.revertedWith("Initializable: contract is already initialized");
    });

    it("should emit the ImplementationUpdated event", async () => {
      await expect(
        await listingFactory
          .connect(admin)
          .updateImplementationContract(newListingImpl.address)
      )
        .to.emit(listingFactory, "ImplementationUpdated")
        .withArgs(newListingImpl.address, 2);
    });
  });
});
