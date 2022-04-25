// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "./roles/AdminRole.sol";
import "./roles/ModeratorRole.sol";

import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

contract NeftieCore is AdminRole, ModeratorRole {
  using AddressUpgradeable for address payable;

  event FundsWithdrawn(address to, uint256 amount);

  function initialize(address _admin) external initializer {
    AdminRole.initializeRole(_admin);
  }

  // solhint-disable-next-line no-empty-blocks
  receive() external payable {}

  /**
   * @dev Setting the amount to 0 will withdraw all funds in the contract
   */
  function withdrawFunds(address payable _to, uint256 _amount)
    external
    onlyAdmin
  {
    require(_to != address(0), "Address cannot be 0");
    require(_to != address(this), "Address cannot be self");

    if (_amount == 0) {
      _amount = address(this).balance;
    }

    _to.sendValue(_amount);

    emit FundsWithdrawn(_to, _amount);
  }
}
