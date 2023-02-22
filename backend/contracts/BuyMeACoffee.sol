// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error BuyMeACoffee__NotEnoughEthSend();
error BuyMeACoffee__NotOwner();
error BuyMeACoffeeFactory__NotSuperUser();
error BuyMeACoffeeFactory_AlreadyRegistered();

contract BuyMeACoffeeFactory {
   address[] private deployedBuyMeCoffees;
   address superUser;
   mapping(address => bool) private registered;
   AggregatorV3Interface private priceFeed;

   modifier onlySuperUser(){
      if(msg.sender != superUser){
         revert BuyMeACoffeeFactory__NotSuperUser();
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
      string memory _description,
      string memory _profile, 
      string memory _thumbnail,
      string[][] memory _items,
      uint256[] memory _itemsValues
   ) public{
      if(registered[msg.sender]){
         revert BuyMeACoffeeFactory_AlreadyRegistered();
      }
      address newBuyMeACoffee = address(new BuyMeACoffee(
         _name, 
         _description, 
         _profile,
         _thumbnail,
         _items,
         _itemsValues,
         msg.sender
      ));
      deployedBuyMeCoffees.push(newBuyMeACoffee);
      registered[msg.sender] = true;
      emit BuyMeACoffeeCreated(newBuyMeACoffee);
   }

   function getDeployedBuyMeACoffee() public view returns (address[] memory){
      return deployedBuyMeCoffees;
   }

   function getSuperUser() public view returns (address){
      return superUser;
   }

   function getGetRegistered() public view returns (bool){
      return registered[msg.sender];
   }

   function getPriceFeed() public view returns (AggregatorV3Interface){
      return priceFeed;
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

   function updatePriceFeed (AggregatorV3Interface _priceFeed) public onlySuperUser{
      priceFeed = _priceFeed;
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

   event AddedItems(uint256 indexed items_id);
   event MemoCreated(
      uint256 indexed timestamp,
      string name,
      string message,
      uint256 items_id
   );
   event MemoResponse (
      uint256 indexed timestamp,
      string indexed response
   );
   event UpdatedCampaign (
      uint256 indexed timestamp,
      string indexed name,
      string indexed description,
      string thumbnail,
      string profile
   );

   Memo[] private memos;
   Items[] private listOfItems;
   address payable private owner;
   uint256 private itemsCount = 0;
   string private name;
   string private profile;
   string private thumbnail;
   string private description;

   constructor( 
      string memory _name, 
      string memory _description, 
      string memory _profile, 
      string memory _thumbnail,
      string[][] memory _items,
      uint256[] memory _itemsValues,
      address _owner
   ) {
      name = _name;
      description = _description;
      profile = _profile;
      thumbnail = _thumbnail;
      owner = payable(_owner);
      formatItems(_items, _itemsValues);
   }

   function formatItems(
      string[][] memory _items, 
      uint256[] memory _itemsValues
   ) public{
      Items[] memory _listOfItems = new Items[](_itemsValues.length);

      for(uint256 i; i < _listOfItems.length; i ++){
         Items memory _newItems = Items(_items[i], _itemsValues[i], itemsCount);
         listOfItems.push(_newItems);
         itemsCount++;
      }
   }

   function setName (string memory _name) public onlyOwner{
      name = _name;
   }

   function setDescription (string memory _description) public onlyOwner{
      description = _description;
   }

   function setProfile (string memory _profile) public onlyOwner{
      profile = _profile;
   }

   function setThumbnail (string memory _thumbnail) public onlyOwner{
      thumbnail = _thumbnail;
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
      emit MemoCreated(block.timestamp, _name, _message, _itemsId);
   }

   function update(
      string memory _name, 
      string memory _description,
      string memory _profile, 
      string memory _thumbnail,
      string[][] memory _items,
      uint256[] memory _itemsValues,
      uint256[] memory _deletedItems
   ) public onlyOwner {
      formatItems(_items, _itemsValues);
      name = _name;
      description = _description;
      profile = _profile;
      thumbnail = _thumbnail;

      for(uint256 i; i < _deletedItems.length; i ++){
         removeItems(_deletedItems[i]);
      }

      emit UpdatedCampaign(
         block.timestamp, 
         _name, 
         _description, 
         _thumbnail, 
         _profile
      );
   }

   function addItems(string[] memory names, uint256 cost) public onlyOwner{
      Items memory _items = Items(names, cost, itemsCount);
      listOfItems.push(_items);
      emit AddedItems(itemsCount);
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

   function getProfile() public view returns (string memory){
      return profile;
   }

   function getThumbnail() public view returns (string memory){
      return thumbnail;
   }

   function getOwner() public view returns (address){
      return owner;
   }

   function getItemsCount() public view returns (uint256){
      return itemsCount;
   }

   function setResponse(uint256 index, string memory response) public onlyOwner {
      Memo storage memo = memos[index]; 
      memo.response = response;
      emit MemoResponse(block.timestamp, response);
   }

   function withdraw() public onlyOwner{
      owner.transfer(address(this).balance);
   }
}
 