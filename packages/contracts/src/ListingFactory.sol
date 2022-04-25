// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "./interfaces/IListingInitializer.sol";
import "./interfaces/ICore.sol";

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ListingFactory {
  using Clones for address;
  using Address for address;
  using Strings for uint256;

  /**
   * @notice The contract that holds all the listing logic and the one
   * new listings are based of off
   */
  address public implementation;

  /**
   * @notice The version of the implementation
   */
  uint256 public implementationVersion;

  /**
   * @notice The contract defining the roles within listings and vault functions.
   * @dev This is typically NeftieCore
   */
  ICore public coreContract;

  /**
   * @notice When a new listing is created
   */
  event ListingCreated(
    address indexed listingAddress,
    address indexed seller,
    string title,
    uint256 price,
    uint256 bondFee,
    uint256 deliveryDays,
    uint256 revisions,
    uint256 nonce
  );

  /**
   * @notice When the core contract is updated
   */
  event CoreContractUpdated(address indexed coreContractAddress);

  /**
   * @notice When the implementation contract is updated
   */
  event ImplementationUpdated(
    address indexed implementation,
    uint256 indexed implementationVersion
  );

  /**
   * @notice Allow only admins
   */
  modifier onlyAdmin() {
    require(coreContract.isAdmin(msg.sender), "Only admin");
    _;
  }

  constructor(address _coreContract) {
    _updateCoreContract(_coreContract);
  }

  /**
   * @notice Creates a new listing
   * @dev https://docs.openzeppelin.com/contracts/4.x/api/proxy#Clones
   */
  function createListing(
    string memory _title,
    uint256 _price,
    uint256 _bondFee,
    uint256 _deliveryDays,
    uint256 _revisions,
    uint256 _nonce
  ) external returns (address listingAddress) {
    // Using the same implementation and salt multiple time will revert
    // since the clones cannot be deployed twice at the same address.

    listingAddress = implementation.cloneDeterministic(
      keccak256(abi.encodePacked(msg.sender, _nonce))
    );

    IListingInitializer(listingAddress).initialize(
      payable(msg.sender),
      _title,
      _price,
      _bondFee,
      _deliveryDays,
      _revisions
    );

    emit ListingCreated(
      listingAddress,
      msg.sender,
      _title,
      _price,
      _bondFee,
      _deliveryDays,
      _revisions,
      _nonce
    );
  }

  /**
   * @notice Get the address of a listing contract by using
   * the seller + nonce
   */
  function predictListingAddress(address _seller, uint256 _nonce)
    external
    view
    returns (address listingAddress)
  {
    listingAddress = implementation.predictDeterministicAddress(
      keccak256(abi.encodePacked(_seller, _nonce))
    );
  }

  /**
   * @notice Update the core contract address
   */
  function updateCoreContract(address _coreContract) external onlyAdmin {
    require(_coreContract.isContract(), "Address is not a contract");
    _updateCoreContract(_coreContract);
  }

  /**
   * @notice Update the implementation contract
   */
  function updateImplementationContract(address _implementationContract)
    external
    onlyAdmin
  {
    require(_implementationContract.isContract(), "Address is not a contract");
    _updateImplementationContract(_implementationContract);
  }

  /**
   * @notice Update the implementation contract
   * @dev Updates the address, increments the version and initializes
   * the implementation
   */
  function _updateImplementationContract(address _implementationContract)
    private
  {
    implementation = _implementationContract;

    unchecked {
      implementationVersion++;
    }

    IListingInitializer(_implementationContract).initialize(
      payable(address(coreContract)),
      string(
        abi.encodePacked(
          "Neftie Listing Implementation (v",
          implementationVersion.toString(),
          ")"
        )
      ),
      2022 ether,
      5 ether,
      1,
      0
    );

    emit ImplementationUpdated(_implementationContract, implementationVersion);
  }

  /**
   * @notice Update the core contract address
   */
  function _updateCoreContract(address _coreContract) private {
    coreContract = ICore(_coreContract);
    emit CoreContractUpdated(_coreContract);
  }
}
