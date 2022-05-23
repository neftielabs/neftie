// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

interface IListingInitializer {
  function initialize(
    address payable _seller,
    string memory _title,
    uint256 _price,
    uint256 _bondFee,
    uint256 _deliveryDays,
    uint256 _revisions
  ) external;
}
