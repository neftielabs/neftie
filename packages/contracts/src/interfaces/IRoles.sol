// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

interface IRoles {
  function isAdmin(address _target) external view returns (bool);

  function isModerator(address _target) external view returns (bool);
}
