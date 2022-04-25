import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { NeftieCore } from "../typechain";
import { contracts } from "./helpers";

describe("NeftieCore", () => {
  let core: NeftieCore;

  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user: SignerWithAddress;
  let receiver: SignerWithAddress;
  let moderator: SignerWithAddress;

  const value = ethers.utils.parseEther("1");

  beforeEach(async () => {
    [owner, admin, user, receiver, moderator] = await ethers.getSigners();

    core = await contracts.deployCore({ admin, owner, moderator });

    await user.sendTransaction({
      to: core.address,
      value,
    });
  });

  describe("roles", () => {
    it("should initialize the admin role", async () => {
      expect(await core.isAdmin(admin.address)).to.eq(true);
    });

    it("should be able to grant the admin role", async () => {
      await core.connect(admin).grantAdmin(user.address);
      expect(await core.isAdmin(user.address)).to.eq(true);
    });

    it("should be able to revoke the admin role", async () => {
      await core.connect(admin).grantAdmin(user.address);
      await core.connect(admin).revokeAdmin(user.address);
      expect(await core.isAdmin(user.address)).to.eq(false);
    });

    it("should be able to grant the moderator role", async () => {
      await core.connect(admin).grantModerator(moderator.address);
      expect(await core.isModerator(moderator.address)).to.eq(true);
    });

    it("should be able to revoke the moderator role", async () => {
      await core.connect(admin).grantModerator(moderator.address);
      await core.connect(admin).revokeModerator(moderator.address);
      expect(await core.isModerator(moderator.address)).to.eq(false);
    });
  });

  describe("withdraw", () => {
    let withdraw: (
      u: SignerWithAddress,
      v?: BigNumber
    ) => Promise<ContractTransaction>;

    beforeEach(() => {
      withdraw = (u: SignerWithAddress, v = value) =>
        core.connect(u).withdrawFunds(receiver.address, v);
    });

    it("should not allow non-admins to withdraw funds", async () => {
      await expect(withdraw(user)).to.be.revertedWith("Only admin");
      await expect(withdraw(moderator)).to.be.revertedWith("Only admin");
    });

    it("should allow admins to withdraw funds", async () => {
      await expect(await withdraw(admin)).to.changeEtherBalances(
        [core, receiver],
        [value.mul(-1), value]
      );
    });

    it("should withdraw all funds if a zero amount is specified", async () => {
      await expect(
        await withdraw(admin, BigNumber.from(0))
      ).to.changeEtherBalances([core, receiver], [value.mul(-1), value]);
    });

    it("should emit the FundsWithdrawn event", async () => {
      await expect(withdraw(admin))
        .to.emit(core, "FundsWithdrawn")
        .withArgs(receiver.address, value);
    });
  });
});
