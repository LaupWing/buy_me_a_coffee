// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error BuyMeACoffee__NotEnoughEthSend();
error BuyMeACoffee__NotOwner();

contract BuyMeACoffeeFactory {
   address[] private deployedBuyMeCoffees;
   address superUser;
   AggregatorV3Interface private priceFeed;

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
         priceFeed
      ));
      deployedBuyMeCoffees.push(newBuyMeACoffee);
   }

   function getDeployedBuyMeACoffee() public view returns (address[] memory){
      return deployedBuyMeCoffees;
   }
}

contract BuyMeACoffee {
   
   struct Memo {
      address from;
      uint256 timestamp;
      string name;
      string message;
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

   modifier onlySuperUser(){
      if(msg.sender != owner){
         revert BuyMeACoffee__NotOwner();
      }
      _;
   }

   Memo[] private memos;
   Items[] private listOfItems;
   AggregatorV3Interface internal priceFeed;
   address private priceFeedAddress;
   address payable private owner;
   uint256 private itemsCount = 0;
   string private name;
   string private description;

   constructor( 
      string memory _name, 
      string memory _description, 
      address _owner,
      AggregatorV3Interface _priceFeed
   ) {
      name = _name;
      description = _description;
      priceFeed = _priceFeed;
      owner = payable(_owner);
   }

   function setPriceFeedAddress (address _priceFeedAddress) public onlyOwner{
      priceFeedAddress = _priceFeedAddress;
   }

   function setName (string memory _name) public onlyOwner{
      name = _name;
   }

   function updatePriceFeed () public onlyOwner{
      priceFeed = AggregatorV3Interface(priceFeedAddress);
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

   function getPriceFeedAddress() public view returns (address){
      return priceFeedAddress;
   }

   function getPriceFeed() public view returns (AggregatorV3Interface){
      return priceFeed;
   }

   function withdraw() public onlyOwner{
      owner.transfer(address(this).balance);
   }
}
 