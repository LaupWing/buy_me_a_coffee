// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

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
    * @notice For example if the deployer want to have items combination of bread and coffee for 15 dollar. This is in usd
    */
   struct Items {
      string[] names;
      uint256 price_in_usd;
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
}
 