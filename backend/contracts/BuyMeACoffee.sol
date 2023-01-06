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
      uint256 price_in_usd;
   }

   Memo[] memos;

   address payable owner;

   constructor() {
      owner = payable(msg.sender);
   }
}
