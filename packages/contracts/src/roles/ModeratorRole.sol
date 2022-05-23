// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract ModeratorRole is Initializable, AccessControlUpgradeable {
  bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");

  modifier onlyModerator() {
    require(hasRole(MODERATOR_ROLE, msg.sender), "Only moderator");
    _;
  }

  function grantModerator(address _target) external {
    grantRole(MODERATOR_ROLE, _target);
  }

  function revokeModerator(address _target) external {
    revokeRole(MODERATOR_ROLE, _target);
  }

  function isModerator(address _target) external view returns (bool) {
    return hasRole(MODERATOR_ROLE, _target);
  }
}
