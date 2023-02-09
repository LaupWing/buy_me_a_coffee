import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { BigNumber } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../helper-hardhat-config"
import { BuyMeACoffee, BuyMeACoffeeFactory, MockV3Aggregator } from "../typechain-types"

interface Item {
   id: BigNumber
   names: string[]
   cost: BigNumber
}

!developmentChains.includes(network.name)
   ? describe.skip
   : describe("BuyMeACoffee", () => {
      let 
         buyMeACoffee: BuyMeACoffee, 
         buyMeACoffeeFactory: BuyMeACoffeeFactory, 
         deployer:string, 
         buyMeACoffeeAddress:string, 
         user1:   SignerWithAddress, 
         user2: SignerWithAddress, 
         mockV3Aggregator: MockV3Aggregator

      const buyMeACoffeeName = "test"
      const buyMeACoffeeDescription = "test description"
      const buyMeACoffeeProfile = "test profile"
      const buyMeACoffeeThumbnail = "test thumbnail"
      const buyMeACoffeeItems = [["coffee", "bagel"], ["coffee", "ice"], ["coffee"]]
      const buyMeACoffeeItemsValues = [
         ethers.utils.parseEther("2"), 
         ethers.utils.parseEther("3"), 
         ethers.utils.parseEther("4")
      ]

      beforeEach(async () => { 
         const accounts = await getNamedAccounts()
         await deployments.fixture(["all"])

         buyMeACoffeeFactory = await ethers.getContract("BuyMeACoffeeFactory")
         const transaction = await buyMeACoffeeFactory.createBuyMeACoffee(
            buyMeACoffeeName, 
            buyMeACoffeeDescription,
            buyMeACoffeeProfile,
            buyMeACoffeeThumbnail,
            buyMeACoffeeItems,
            buyMeACoffeeItemsValues
         )
         const transactionReceipt = await transaction.wait()
         buyMeACoffeeAddress = transactionReceipt.events?.find(x => x.event === "BuyMeACoffeeCreated")?.args?.buyMeACoffeeAddress
         buyMeACoffee = await ethers.getContractAt("BuyMeACoffee", buyMeACoffeeAddress)

         mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
         deployer = accounts.deployer
         user1 = await ethers.getNamedSigner("user1")
         user2 = await ethers.getNamedSigner("user2")
      })
      
      describe("Constructor", () => {
         it("sets up starting values correctly", async () => {
            expect(await buyMeACoffeeFactory.getDeployedBuyMeACoffee()).to.have.members([buyMeACoffeeAddress])
            expect(await buyMeACoffeeFactory.getSuperUser()).equal(deployer)
            expect(await buyMeACoffee.getName()).equal(buyMeACoffeeName)
            expect(await buyMeACoffee.getOwner()).equal(deployer)
            expect(await buyMeACoffeeFactory.getPriceFeed()).equal(mockV3Aggregator.address)
            expect(await buyMeACoffee.getProfile()).equal(buyMeACoffeeProfile)
            expect(await buyMeACoffee.getThumbnail()).equal(buyMeACoffeeThumbnail)
            expect(await buyMeACoffeeFactory.getGetRegistered()).to.be.true
         })

         it("reverts with custom error when deployer wants to create another campaign", async () => {
            await expect(buyMeACoffeeFactory.createBuyMeACoffee(
               buyMeACoffeeName, 
               buyMeACoffeeDescription,
               buyMeACoffeeProfile,
               buyMeACoffeeThumbnail,
               buyMeACoffeeItems,
               buyMeACoffeeItemsValues
            )).to.be.revertedWithCustomError(buyMeACoffeeFactory, "BuyMeACoffeeFactory_AlreadyRegistered")
         })

         it("emits event when new contract has been made", async () =>{
            const transaction = await buyMeACoffeeFactory.connect(user1).createBuyMeACoffee(
               "test name", 
               "test description",
               "test profile",
               "test thumbnail",
               [["coffee"]],
               [1]
            )
            const transactionReceipt = await transaction.wait()
            const address = transactionReceipt?.events?.find(x => x.event === "BuyMeACoffeeCreated")?.args?.buyMeACoffeeAddress 
            
            await expect(transaction).to.emit(buyMeACoffeeFactory, "BuyMeACoffeeCreated")
               .withArgs(address)
         })

         it("allows owner to change description and name", async () => {
            await buyMeACoffee.setName("Test2")
            expect(await buyMeACoffee.getName()).equal("Test2")

            await buyMeACoffee.setDescription("Description test2")
            expect(await buyMeACoffee.getDescription()).equal("Description test2")

            await buyMeACoffee.setProfile("Profile test2")
            expect(await buyMeACoffee.getProfile()).equal("Profile test2")

            await buyMeACoffee.setThumbnail("Thumbnail test2")
            expect(await buyMeACoffee.getThumbnail()).equal("Thumbnail test2")
         })

         it("can get the latest price in dollars", async () =>{
            const latestPrice = (await buyMeACoffeeFactory.getLatestPrice()).toString() 
            const decimals = (await buyMeACoffeeFactory.getDecimals()).toString()
            expect(Number(latestPrice) / 10**Number(decimals)).equal(200)
         })

         it("superuser can update the pricefeed", async () => {
            await buyMeACoffeeFactory.updatePriceFeed(user1.address)
            expect(await buyMeACoffeeFactory.getPriceFeed()).equal(user1.address)
         })

         it("reverts when not superuser updates", async () => {
            await expect(buyMeACoffeeFactory.connect(user1).updatePriceFeed(user1.address))
               .to.be.revertedWithCustomError(buyMeACoffeeFactory, "BuyMeACoffeeFactory__NotSuperUser")
         })

         it("reverts when not owner wants to change things", async () => {
            await expect(buyMeACoffee.connect(user1).setName("test3"))
               .to.be.revertedWithCustomError( buyMeACoffee,"BuyMeACoffee__NotOwner")
            
            await expect(buyMeACoffee.connect(user1).setDescription("Test description"))
               .to.be.revertedWithCustomError( buyMeACoffee,"BuyMeACoffee__NotOwner")
         })
      })

      describe("Items", () => {
         let items:Item[]
         let itemsCount:string
         const firstSetOfItems = ["cookies", "cappochino"]
         const secondSetOfItems = ["Coffee"]
         const firstSetOfItemsCost = ethers.utils.parseEther("0.01")
         const secondSetOfItemsCost = ethers.utils.parseEther("0.001")

         beforeEach(async () => {
            itemsCount = (await buyMeACoffee.getItemsCount()).toString()
            await buyMeACoffee.addItems(firstSetOfItems, firstSetOfItemsCost)
            await buyMeACoffee.addItems(secondSetOfItems, secondSetOfItemsCost)
            items = (await buyMeACoffee.getListOfItems())
         })

         it("allows owner to add item to the contract", async () => {
            const startingPoint = buyMeACoffeeItems.length
            expect(items[startingPoint + 0].id.toString()).equal(itemsCount)
            expect(items[startingPoint + 0].names).to.have.same.members(firstSetOfItems)
            expect(items[startingPoint + 0].cost.toString()).equal(firstSetOfItemsCost)

            expect(items[startingPoint + 1].id.toString()).equal(String(Number(itemsCount) + 1))
            expect(items[startingPoint + 1].names).to.have.same.members(secondSetOfItems)
            expect(items[startingPoint + 1].cost.toString()).equal(secondSetOfItemsCost)
         })

         it("removes first set of items from the list of items", async () => {
            const _itemsCount = (await buyMeACoffee.getListOfItems()).length
            
            await buyMeACoffee.removeItems("0")
            const listOfItems = await buyMeACoffee.getListOfItems() 
            expect(listOfItems.length).equal(_itemsCount - 1)
            expect(listOfItems[0].names).to.have.same.members(secondSetOfItems)
         })

         it("reverts when other users try removing or adding item", async () => {
            await expect(buyMeACoffee.connect(user1).addItems(["test"], 1))
               .to.be.revertedWithCustomError(buyMeACoffee, "BuyMeACoffee__NotOwner")

            await expect(buyMeACoffee.connect(user1).removeItems(0))
               .to.be.revertedWithCustomError(buyMeACoffee, "BuyMeACoffee__NotOwner")
             
         })
      })

      describe("Memos", () =>{
         const firstSetOfItems = ["cookies", "cappochino"]
         const firstSetOfItemsCost = ethers.utils.parseEther("0.01")
         let items: Item[]
         let itemsCount:string
         const name = "Laup"
         const message = "A nice message"
         let itemsId:string 

         beforeEach(async () => {
            itemsCount = (await buyMeACoffee.getItemsCount()).toString()
            const transaction = await buyMeACoffee.addItems(firstSetOfItems, firstSetOfItemsCost)
            const transactionReceipt = await transaction.wait()
            const event = transactionReceipt.events?.find(e => e.event === "AddedItems")
            itemsId = event?.args!.items_id.toString()

            items = (await buyMeACoffee.getListOfItems())
         })

         it("allows users to store memo aka give the owner some eth by buyin him/her an item", async () => {
            expect((await buyMeACoffee.getItemsCount()).toString()).equal(String(Number(itemsCount) + 1))
            await buyMeACoffee.connect(user1).storeMemo(name, message, itemsId, {
               value: firstSetOfItemsCost
            })
            expect((await ethers.provider.getBalance(buyMeACoffee.address))).equal(firstSetOfItemsCost)
            const memos = await buyMeACoffee.getMemos()
            
            expect(memos[0].name).equal(name)
            expect(memos[0].message).equal(message)
            expect(memos[0].items_id.toString()).equal(itemsId)
         })

         it("emits MemoCreated event after memo has been stored", async () => {
            const currentBlock = await ethers.provider.getBlockNumber()
            const block = await ethers.provider.getBlock(currentBlock)
            const transaction = await buyMeACoffee.connect(user1).storeMemo(name, message, itemsId, {
               value: firstSetOfItemsCost
            })
            
            await expect(transaction).to.emit(buyMeACoffee, "MemoCreated")
               .withArgs(block.timestamp + 1, name, message, itemsId)
         })

         it.only("allows the owner to response to a donation", async () => {
            await buyMeACoffee.connect(user1).storeMemo(name, message, itemsId, {
               value: firstSetOfItemsCost
            })
            console.log(await buyMeACoffee.setReply(0, "Test"))
            console.log(await buyMeACoffee.getMemos())
         })

         it("reverts with error when not enough eth is sent", async () => {
            // console.log(await buyMeACoffee.getListOfItems())
            await expect(buyMeACoffee.connect(user1).storeMemo(name, message, itemsId, {
               value: ethers.utils.parseEther("0.001")
            })).revertedWithCustomError(buyMeACoffee, "BuyMeACoffee__NotEnoughEthSend")
         })

         it("allows owner to withdraw eth", async () => {
            await buyMeACoffee.connect(user1).storeMemo(name, message, itemsId, {
               value: firstSetOfItemsCost
            })
            const deployerBeginBalance = await ethers.provider.getBalance(deployer)
            const transaction = await buyMeACoffee.withdraw()
            const transactionReceipt = await transaction.wait()
            const gasPrice = transactionReceipt.gasUsed.mul(transactionReceipt.effectiveGasPrice) 
            expect(deployerBeginBalance.add(firstSetOfItemsCost).sub(gasPrice))
               .equal(await ethers.provider.getBalance(deployer))
         })
      })

   })
