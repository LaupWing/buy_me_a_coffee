// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error NotEnoughEthSend();

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
   }

   Memo[] private memos;
   Items[] private items;
   AggregatorV3Interface internal priceFeed;
   address private priceFeedAddress;
   address payable owner;

   constructor(address _priceFeedAddress, Items[] memory _items) {
      priceFeedAddress = _priceFeedAddress;
      items = _items;
      priceFeed = AggregatorV3Interface(priceFeedAddress);
      owner = payable(msg.sender);
   }

   function setPriceFeedAddress (address _priceFeedAddress) public{
      priceFeedAddress = _priceFeedAddress;
   }

   function updatePriceFeed () public{
      priceFeed = AggregatorV3Interface(priceFeedAddress);
   }

   function storeMemo(Memo memory memo) public payable {
      if(msg.value < memo.items.cost){
         revert NotEnoughEthSend();
      }
      memos.push(memo);
   }

   function setPriceFeedAddress() public view returns(address){
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

   function getItems() public view returns (Items[] memory){
      return items;
   }
}
 