// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error BuyMeACoffee__NotEnoughEthSend();
error BuyMeACoffee__NotOwner();
error BuyMeACoffee__NotSuperUser();

contract BuyMeACoffeeFactory {
   address[] private deployedBuyMeCoffees;
   address superUser;
   AggregatorV3Interface private priceFeed;

   modifier onlySuperUser(){
      if(msg.sender != superUser){
         revert BuyMeACoffee__NotSuperUser();
      }
      _;
   }

   event BuyMeACoffeeCreated(address indexed buyMeACoffeeAddress);

   constructor(address _priceFeedAddress){
      superUser = msg.sender;
      priceFeed = AggregatorV3Interface(_priceFeedAddress);
   }  

   function createBuyMeACoffee(
      string memory _name, 
      string memory _description
   ) public{
      address newBuyMeACoffee = address(new BuyMeACoffee(
         _name, 
         _description, 
         msg.sender,
         superUser,
         priceFeed
      ));
      deployedBuyMeCoffees.push(newBuyMeACoffee);
      emit BuyMeACoffeeCreated(newBuyMeACoffee);
   }

   function getDeployedBuyMeACoffee() public view returns (address[] memory){
      return deployedBuyMeCoffees;
   }

   function updatePricefeed(address _priceFeedAddress) public onlySuperUser{
      priceFeed = AggregatorV3Interface(_priceFeedAddress);
      for(uint256 i; i < deployedBuyMeCoffees.length; i ++){
         BuyMeACoffee _contract = BuyMeACoffee(deployedBuyMeCoffees[i]);
         _contract.updatePriceFeed(priceFeed, msg.sender);
      }
   }
}

contract BuyMeACoffee {
   
   struct Memo {
      address from;
      uint256 timestamp;
      string name;
      string message;
      string response;
      uint256 items_id;
   }

   /**
    * @dev The deployer of the contract can define a combination of items 
    * @notice For example if the deployer want to have items combination of bread and coffee for 15 eth. In the frontend the deployer can put in the amount in dollars but it will be saved as eth.
    */
   struct Items {
      string[] names;
      uint256 cost;
      uint256 id;
   }

   modifier onlyOwner(){
      if(msg.sender != owner){
         revert BuyMeACoffee__NotOwner();
      }
      _;
   }

   modifier onlySuperUser(address sender){
      if(sender != superUser){
         revert BuyMeACoffee__NotSuperUser();
      }
      _;
   }

   Memo[] private memos;
   Items[] private listOfItems;
   AggregatorV3Interface internal priceFeed;
   address payable private owner;
   address private superUser;
   uint256 private itemsCount = 0;
   string private name;
   string private description;

   constructor( 
      string memory _name, 
      string memory _description, 
      address _owner,
      address _superUser,
      AggregatorV3Interface _priceFeed
   ) {
      name = _name;
      description = _description;
      priceFeed = _priceFeed;
      owner = payable(_owner);
      superUser = _superUser;
   }

   function setName (string memory _name) public onlyOwner{
      name = _name;
   }

   function setDescription (string memory _description) public onlyOwner{
      description = _description;
   }

   function updatePriceFeed (AggregatorV3Interface _priceFeed, address sender) public onlySuperUser(sender){
      priceFeed = _priceFeed;
   }

   function storeMemo(
      string memory _name,
      string memory _message, 
      uint256 _itemsId
   ) public payable {
      Items memory items;
      for(uint256 i; i < listOfItems.length; i ++){
         if(listOfItems[i].id == _itemsId){
            items = listOfItems[i];
         }
      }
      if(msg.value < items.cost){
         revert BuyMeACoffee__NotEnoughEthSend();
      }
      memos.push(Memo(
         msg.sender, 
         block.timestamp, 
         _name, 
         _message, 
         "",
         _itemsId
      ));
   }

   function addItems(string[] memory names, uint256 cost) public onlyOwner{
      Items memory _items = Items(names, cost, itemsCount);
      listOfItems.push(_items);
      itemsCount++;
   }

   function removeItems(uint256 _id) public onlyOwner{
      for(uint256 i; i < listOfItems.length; i ++){
         if(listOfItems[i].id == _id){
            listOfItems[i] = listOfItems[listOfItems.length -1];
            listOfItems.pop();
         }
      }
   }

   function getLatestPrice() public view returns (int256){
      (
         ,
         int256 price,
         ,
         ,
      ) = priceFeed.latestRoundData();
      return price;
   }

   function getDecimals() public view returns(uint8)  {
      uint8 decimals = priceFeed.decimals();
      return decimals;
   }

   function getMemos() public view returns(Memo[] memory){
      return memos;
   }

   function getListOfItems() public view returns (Items[] memory){
      return listOfItems;
   }

   function getName() public view returns (string memory){
      return name;
   }

   function getDescription() public view returns (string memory){
      return description;
   }

   function getOwner() public view returns (address){
      return owner;
   }

   function getPriceFeed() public view returns (AggregatorV3Interface){
      return priceFeed;
   }

   function withdraw() public onlyOwner{
      owner.transfer(address(this).balance);
   }
}
 