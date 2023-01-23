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
      const buyMeACoffeeItemsValues = [2, 3, 4]

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
         it.only("sets up starting values correctly", async () => {
            expect(await buyMeACoffeeFactory.getDeployedBuyMeACoffee()).to.have.members([buyMeACoffeeAddress])
            expect(await buyMeACoffee.getName()).equal(buyMeACoffeeName)
            expect(await buyMeACoffee.getOwner()).equal(deployer)
            expect(await buyMeACoffee.getPriceFeed()).equal(mockV3Aggregator.address)
            expect(await buyMeACoffee.getProfile()).equal(buyMeACoffeeProfile)
            expect(await buyMeACoffee.getThumbnail()).equal(buyMeACoffeeThumbnail)
            expect(await buyMeACoffee.getSuperUser()).equal(deployer)
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
            const latestPrice = (await buyMeACoffee.getLatestPrice()).toString() 
            const decimals = (await buyMeACoffee.getDecimals()).toString()
            expect(Number(latestPrice) / 10**Number(decimals)).equal(200)
         })

         it("superuser can update the pricefeed", async () => {
            await buyMeACoffeeFactory.updatePricefeed(user1.address)
            expect(await buyMeACoffee.getPriceFeed()).equal(user1.address)
         })

         it("reverts when not superuser updates", async () => {
            await expect(buyMeACoffeeFactory.connect(user1).updatePricefeed(user1.address))
               .to.be.revertedWithCustomError(buyMeACoffee, "BuyMeACoffee__NotSuperUser")

            await expect(buyMeACoffee.connect(user1).updatePriceFeed(user1.address, user1.address))
               .to.be.revertedWithCustomError(buyMeACoffee, "BuyMeACoffee__NotSuperUser")
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
         const firstSetOfItems = ["cookies", "cappochino"]
         const secondSetOfItems = ["Coffee"]
         const firstSetOfItemsCost = ethers.utils.parseEther("0.01")
         const secondSetOfItemsCost = ethers.utils.parseEther("0.001")

         beforeEach(async () => {
            await buyMeACoffee.addItems(firstSetOfItems, firstSetOfItemsCost)
            await buyMeACoffee.addItems(secondSetOfItems, secondSetOfItemsCost)
            items = (await buyMeACoffee.getListOfItems())
         })

         it("allows owner to add item to the contract", async () => {
            expect(items[0].id.toString()).equal("0")
            expect(items[0].names).to.have.same.members(firstSetOfItems)
            expect(items[0].cost.toString()).equal(firstSetOfItemsCost)

            expect(items[1].id.toString()).equal("1")
            expect(items[1].names).to.have.same.members(secondSetOfItems)
            expect(items[1].cost.toString()).equal(secondSetOfItemsCost)
         })

         it("removes first set of items from the list of items", async () => {
            await buyMeACoffee.removeItems("0")
            const listOfItems = await buyMeACoffee.getListOfItems() 
            expect(listOfItems.length).equal(1)
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
         const name = "Laup"
         const message = "A nice message"
         const itemsId = "0" 

         beforeEach(async () => {
            await buyMeACoffee.addItems(firstSetOfItems, firstSetOfItemsCost)
            items = (await buyMeACoffee.getListOfItems())
         })
         it("allows users to store memo aka give the owner some eth by buyin him/her an item", async () => {
            expect((await buyMeACoffee.getItemsCount()).toString()).equal("1")
            await buyMeACoffee.connect(user1).storeMemo(name, message, itemsId, {
               value: firstSetOfItemsCost
            })
            expect((await ethers.provider.getBalance(buyMeACoffee.address))).equal(firstSetOfItemsCost)
            const memos = await buyMeACoffee.getMemos()
            
            expect(memos[0].name).equal(name)
            expect(memos[0].message).equal(message)
            expect(memos[0].items_id.toString()).equal(itemsId)
         })

         it("reverts with error when not enough eth is sent", async () => {
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
