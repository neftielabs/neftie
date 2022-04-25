// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract AdminRole is Initializable, AccessControlUpgradeable {
  modifier onlyAdmin() {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only admin");
    _;
  }

  function initializeRole(address _target) internal onlyInitializing {
    _setupRole(DEFAULT_ADMIN_ROLE, _target);
  }

  function grantAdmin(address _target) external {
    grantRole(DEFAULT_ADMIN_ROLE, _target);
  }

  function revokeAdmin(address _target) external {
    revokeRole(DEFAULT_ADMIN_ROLE, _target);
  }

  function isAdmin(address _target) external view returns (bool) {
    return hasRole(DEFAULT_ADMIN_ROLE, _target);
  }
}
