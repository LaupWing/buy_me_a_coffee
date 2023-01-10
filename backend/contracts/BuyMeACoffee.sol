// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error BuyMeACoffee__NotEnoughEthSend();
error BuyMeACoffee__NotOwner();

contract BuyMeACoffee {
   
   struct Memo {
      address from;
      uint256 timestamp;
      string name;
      string message;
      Items items;
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

   Memo[] private memos;
   Items[] private listOfItems;
   AggregatorV3Interface internal priceFeed;
   address private priceFeedAddress;
   address payable private owner;
   uint256 private itemsCount = 0;
   string private name;

   constructor(address _priceFeedAddress, string memory _name) {
      priceFeedAddress = _priceFeedAddress;
      name = _name;
      priceFeed = AggregatorV3Interface(priceFeedAddress);
      owner = payable(msg.sender);
   }

   function setPriceFeedAddress (address _priceFeedAddress) public{
      priceFeedAddress = _priceFeedAddress;
   }

   function setName (string memory _name) public onlyOwner{
      name = _name;
   }

   function updatePriceFeed () public onlyOwner{
      priceFeed = AggregatorV3Interface(priceFeedAddress);
   }

   function storeMemo(Memo memory memo) public payable {
      if(msg.value < memo.items.cost){
         revert BuyMeACoffee__NotEnoughEthSend();
      }
      memos.push(memo);
   }

   function addItem(string[] memory names, uint256 cost) public onlyOwner{
      Items memory _items = Items(names, cost, itemsCount);
      listOfItems.push(_items);
      itemsCount++;
   }

   function removeItem(uint256 _id) public onlyOwner{
      for(uint256 i; i < listOfItems.length; i ++){
         if(listOfItems[i].id == _id){
            listOfItems[i] = listOfItems[listOfItems.length -1];
            listOfItems.pop();
         }
      }
   }

   function setPriceFeedAddress() public view onlyOwner returns(address) {
      return priceFeedAddress;
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

   function getMemos() public view returns(Memo[] memory){
      return memos;
   }

   function getListOfItems() public view returns (Items[] memory){
      return listOfItems;
   }

   function getName() public view returns (string memory){
      return name;
   }

   function getOwner() public view returns (address){
      return owner;
   }
}
 