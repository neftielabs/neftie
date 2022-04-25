// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.0;

import "./interfaces/IListingInitializer.sol";
import "./interfaces/IListingFactory.sol";

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Listing is Initializable, IListingInitializer, ReentrancyGuard {
  using Address for address;
  using Address for address payable;

  /**
   * @notice The different statuses an order can have during its course
   */
  enum OrderStatus {
    PLACED,
    DISMISSED,
    ONGOING,
    CANCELLED,
    DELIVERED,
    COMPLETED
  }

  /**
   * @notice The listing's details
   */
  struct ListingDetails {
    string title;
    uint256 price;
    uint256 bondFee;
    uint256 deliveryDays;
    uint256 revisions;
  }

  /**
   * @notice Each order details
   */
  struct Order {
    address payable client;
    OrderStatus status;
    uint256 startedAt;
    uint256 deliveredAt;
    uint256 completedAt;
    uint256 revisionsLeft;
    uint256 tips;
    bool underRevision;
    bool bondFeeWithdrawn;
  }

  /**
   * @notice The % neftie takes from an order
   */
  uint256 public constant ORDER_FEE = 15;

  /**
   * @notice The % neftie takes from a tip
   */
  uint256 public constant TIP_FEE = 5;

  /**
   * @notice The % neftie takes from a cancelled order
   */
  uint256 public constant CANCELLATION_FEE = 10;

  /**
   * @notice Maximum number of days an order can take to complete
   * @dev In days
   */
  uint256 public constant MAX_DELIVERY_DAYS = 10;

  /**
   * @notice Number of days the client has to request a revision after an order is delivered
   * @dev In days
   */
  uint256 public constant REVISION_TIMESPAN = 3 days;

  /**
   * @notice Number of days the client has to request a revision after an order is delivered
   * @dev In days
   */
  uint256 public constant WITHDRAW_TIMESPAN = 7 days;

  /**
   * @notice The factory used to create this contract
   */
  IListingFactory public immutable listingFactory;

  /**
   * @notice The owner of the contract (the seller)
   */
  address payable public seller;

  /**
   * @notice The listing's details
   */
  ListingDetails public listing;

  /**
   * @notice To keep track of the latest count and create
   * order ids
   */
  uint256 public lastOrderCount = 0;

  /**
   * @notice Map of orders indexed by the order id
   */
  mapping(bytes32 => Order) public orders;

  /**
   * @notice When an order is placed and is waiting for
   * the seller approval
   */
  event OrderPlaced(bytes32 indexed orderId, address indexed client);

  /**
   * @notice When an order is approved by the seller
   */
  event OrderApproved(bytes32 indexed orderId);

  /**
   * @notice When an order is dismissed by either the seller or the client
   */
  event OrderDismissed(bytes32 indexed orderId, address author);

  /**
   * @notice When an order is cancelled
   */
  event OrderCancelled(bytes32 indexed orderId, address author);

  /**
   * @notice When an order is delivered
   */
  event OrderDelivered(bytes32 indexed orderId);

  /**
   * @notice When a revision is requested
   */
  event RevisionRequested(bytes32 indexed orderId);

  /**
   * @notice When a tip is sent to the seller
   */
  event Tip(bytes32 indexed orderId, uint256 amount);

  /**
   * @notice When the seller withdraws funds from the contract
   */
  event FundsWithdrawn(bytes32 indexed orderId);

  /**
   * @notice When the client withdraws the bond fee
   */
  event BondFeeWithdrawn(bytes32 indexed orderId);

  /**
   * @notice Allow only a moderator defined in the core contract
   */
  modifier onlyModerator() {
    require(
      listingFactory.coreContract().isModerator(msg.sender),
      "Only moderator"
    );
    _;
  }

  /**
   * @notice Allow only the seller (owner of the contract)
   */
  modifier onlySeller() {
    require(msg.sender == seller, "Only seller");
    _;
  }

  /**
   * @notice Allow only a given status
   */
  modifier onlyStatus(bytes32 _orderId, OrderStatus _status) {
    require(orders[_orderId].status == _status, "Not allowed by order status");
    _;
  }

  /**
   * @notice Allow only the client of an order
   */
  modifier onlyClient(bytes32 _orderId) {
    require(orders[_orderId].client == msg.sender, "Only client");
    _;
  }

  /**
   * @notice Allow either the client or the seller
   */
  modifier bothSellerOrClient(bytes32 _orderId) {
    require(
      orders[_orderId].client == msg.sender || seller == msg.sender,
      "Only client or seller"
    );
    _;
  }

  /**
   * @dev Assign the factory address upon creation of the contract
   */
  constructor(address _listingFactoryAddress) {
    require(
      _listingFactoryAddress.isContract(),
      "Listing factory is not a contract"
    );

    listingFactory = IListingFactory(_listingFactoryAddress);
  }

  /**
   * @notice Create a new listing
   * @param _seller Seller and owner of the contract
   * @param _title Title of the listing
   * @param _price Price of the listing
   * @param _bondFee A security fee the seller can set
   * @param _deliveryDays The number of days it takes to complete an order
   */
  function initialize(
    address payable _seller,
    string memory _title,
    uint256 _price,
    uint256 _bondFee,
    uint256 _deliveryDays,
    uint256 _revisions
  ) external override initializer {
    require(
      msg.sender == address(listingFactory),
      "Must be created with the ListingFactory"
    );
    require(bytes(_title).length > 0, "Title is required");
    require(_price > 0, "Price is required");
    require(_bondFee < _price, "Bond fee cannot be higher than price");
    require(_price + _bondFee >= _price, "Price + bond fee must be >= price");
    require(
      _deliveryDays > 0 && _deliveryDays <= MAX_DELIVERY_DAYS,
      "Invalid delivery days"
    );

    seller = _seller;
    listing.title = _title;
    listing.price = _price;
    listing.bondFee = _bondFee;
    listing.deliveryDays = _deliveryDays * 1 days;
    listing.revisions = _revisions;
  }

  /**
   * @notice Allows anyone to place an order request, by paying
   * the price + bond fee upfront
   */
  function placeOrder() external payable nonReentrant {
    require(
      msg.value >= listing.price + listing.bondFee,
      "Value must match listing price + bond fee"
    );
    require(
      msg.sender != seller,
      "A seller cannot place an order in its own listing"
    );

    // Refund any surplus to the client

    uint256 surplus = msg.value - (listing.price + listing.bondFee);

    if (surplus > 0) {
      payable(msg.sender).sendValue(surplus);
    }

    // Create order id

    unchecked {
      lastOrderCount++;
    }

    bytes32 orderId = keccak256(
      abi.encodePacked(lastOrderCount, msg.sender, block.timestamp)
    );

    // Save order

    orders[orderId].client = payable(msg.sender);
    orders[orderId].status = OrderStatus.PLACED;
    orders[orderId].startedAt = block.timestamp;
    orders[orderId].revisionsLeft = listing.revisions;
    orders[orderId].underRevision = false;
    orders[orderId].bondFeeWithdrawn = false;

    emit OrderPlaced(orderId, msg.sender);
  }

  /**
   * @notice Seller can approve an order in status PLACED
   */
  function approveOrder(bytes32 _orderId)
    external
    onlySeller
    onlyStatus(_orderId, OrderStatus.PLACED)
  {
    orders[_orderId].status = OrderStatus.ONGOING;

    emit OrderApproved(_orderId);
  }

  /**
   * @notice Seller or client can dismiss an order request before it is
   * approved and the client will be refunded the price and bond fee.
   */
  function dismissOrder(bytes32 _orderId)
    external
    bothSellerOrClient(_orderId)
    onlyStatus(_orderId, OrderStatus.PLACED)
  {
    orders[_orderId].status = OrderStatus.DISMISSED;
    _refundClient(_orderId);
    emit OrderDismissed(_orderId, msg.sender);
  }

  /**
   * @notice Both the seller or the client can cancel an order any time, but there will
   * be different outcomes depending on who cancels it.
   *
   * If the order is cancelled by the seller:
   *   Client is refunded both the price and the bond fee
   *
   * If the order is cancelled by the client:
   *   If the deadline has not been reached, client is refunded the 90% of the price as a penalty
   *   for cancelling and the seller receives the bond fee. The remaining 10% is transferred
   *   to neftie's vault.
   *   If the order is past due, then the seller gets a full refund without any penalty.
   */
  function cancelOrder(bytes32 _orderId)
    external
    bothSellerOrClient(_orderId)
    onlyStatus(_orderId, OrderStatus.ONGOING)
  {
    orders[_orderId].status = OrderStatus.CANCELLED;

    if (msg.sender == seller || isOrderPastDue(_orderId)) {
      // Order was cancelled by seller or was past due
      _refundClient(_orderId);
    } else {
      // Order was cancelled by the client or was not past due
      seller.sendValue(listing.bondFee);

      uint256 penalty = (listing.price * CANCELLATION_FEE) / 100;
      orders[_orderId].client.sendValue(listing.price - penalty);
      _sendToVault(penalty);
    }

    emit OrderCancelled(_orderId, msg.sender);
  }

  /**
   * @notice Seller can mark the order as delivered
   * when they are done. To prevent fraud, funds are kept for x days
   * before they can be withdrawn in order to allow for disputes after
   * the delivery. Also, the client can only request revisions before
   * a specified number of days after the delivery.
   */
  function deliverOrder(bytes32 _orderId)
    external
    onlySeller
    onlyStatus(_orderId, OrderStatus.ONGOING)
  {
    orders[_orderId].status = OrderStatus.DELIVERED;
    orders[_orderId].deliveredAt = block.timestamp;
    orders[_orderId].underRevision = false;

    emit OrderDelivered(_orderId);
  }

  /**
   * @notice Client can request a revision if there are any left.
   * @dev Details are kept off-chain.
   */
  function requestRevision(bytes32 _orderId)
    external
    onlyClient(_orderId)
    onlyStatus(_orderId, OrderStatus.DELIVERED)
  {
    require(orders[_orderId].revisionsLeft > 0, "No revisions left");
    require(
      block.timestamp <= orders[_orderId].deliveredAt + REVISION_TIMESPAN,
      "Revision timespan has passed"
    );

    orders[_orderId].underRevision = true;
    orders[_orderId].status = OrderStatus.ONGOING;

    unchecked {
      orders[_orderId].revisionsLeft--;
    }

    emit RevisionRequested(_orderId);
  }

  /**
   * @notice Client can tip the seller once an order is delivered as many
   * times as they want. Neftie takes a cut.
   */
  function tipSeller(bytes32 _orderId)
    external
    payable
    onlyClient(_orderId)
    onlyStatus(_orderId, OrderStatus.DELIVERED)
  {
    require(msg.value > 0, "Tip must be greater than 0");

    uint256 cut = (msg.value * TIP_FEE) / 100;

    _sendToVault(cut);

    orders[_orderId].tips += msg.value - cut;

    emit Tip(_orderId, msg.value);
  }

  /**
   * @notice Seller can withdraw the funds associated to an order
   * and client can withdraw the bond fee.
   * Only once x days have passed since it was marked as delivered.
   */
  function withdrawOrderFunds(bytes32 _orderId)
    external
    bothSellerOrClient(_orderId)
    onlyStatus(_orderId, OrderStatus.DELIVERED)
  {
    require(
      block.timestamp > orders[_orderId].deliveredAt + WITHDRAW_TIMESPAN,
      "Cannot withdraw funds yet"
    );

    if (msg.sender == seller) {
      require(
        orders[_orderId].status == OrderStatus.DELIVERED,
        "Not allowed by order status"
      );

      orders[_orderId].status = OrderStatus.COMPLETED;

      uint256 orderFee = (listing.price * ORDER_FEE) / 100;
      seller.sendValue((listing.price - orderFee) + orders[_orderId].tips);
      _sendToVault(orderFee);

      emit FundsWithdrawn(_orderId);
    } else {
      require(
        orders[_orderId].status == OrderStatus.DELIVERED ||
          orders[_orderId].status == OrderStatus.COMPLETED,
        "Not allowed by order status"
      );
      require(
        orders[_orderId].bondFeeWithdrawn == false,
        "Bond fee already withdrawn"
      );

      orders[_orderId].bondFeeWithdrawn = true;
      seller.sendValue(listing.bondFee);

      emit BondFeeWithdrawn(_orderId);
    }
  }

  /**
   * @notice Returns the payable core contract address
   */
  function getCoreAddress() public returns (address payable coreAddress) {
    coreAddress = payable(address(listingFactory.coreContract()));
  }

  /**
   * @notice Determines if an order is past due
   */
  function isOrderPastDue(bytes32 _orderId) public view returns (bool) {
    return block.timestamp > orders[_orderId].startedAt + listing.deliveryDays;
  }

  /**
   * @notice Refund the client the price and the bond fee
   */
  function _refundClient(bytes32 _orderId) private {
    orders[_orderId].client.sendValue(listing.price);
    orders[_orderId].client.sendValue(listing.bondFee);
  }

  /**
   * @notice Transfer funds to the vault (platform fees)
   */
  function _sendToVault(uint256 amount) private {
    getCoreAddress().sendValue(amount);
  }
}
