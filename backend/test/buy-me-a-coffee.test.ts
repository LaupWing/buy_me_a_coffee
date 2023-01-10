import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { BigNumber } from "ethers"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../helper-hardhat-config"
import { BuyMeACoffee, MockV3Aggregator } from "../typechain-types"

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
         deployer:string, 
         user1:   SignerWithAddress, 
         user2: SignerWithAddress, 
         mockV3Aggregator: MockV3Aggregator

      beforeEach(async () => { 
         const accounts = await getNamedAccounts()
         await deployments.fixture(["all"])
         buyMeACoffee = await ethers.getContract("BuyMeACoffee")
         mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
         deployer = accounts.deployer
         user1 = await ethers.getNamedSigner("user1")
         user2 = await ethers.getNamedSigner("user2")
      })
      
      describe("Constructor", () => {
         it("sets up starting values correctly", async () => {
            expect(await buyMeACoffee.getName()).equal("Test")
            expect(await buyMeACoffee.getOwner()).equal(deployer)
            expect(await buyMeACoffee.getPriceFeedAddress()).equal(mockV3Aggregator.address)
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

         beforeEach(async () => {
            await buyMeACoffee.addItems(firstSetOfItems, firstSetOfItemsCost)
            items = (await buyMeACoffee.getListOfItems())
         })
         it("allows users to store memo aka give the owner some eth by buyin him/her an item", async () => {
            const name = "Laup"
            const message = "A nice message"
            const itemsId = "0" 

            await buyMeACoffee.connect(user1).storeMemo(name, message, itemsId, {
               value: firstSetOfItemsCost
            })
            expect((await ethers.provider.getBalance(buyMeACoffee.address))).equal(firstSetOfItemsCost)
            const memos = await buyMeACoffee.getMemos()

            expect(memos[0].name).equal(name)
            expect(memos[0].message).equal(message)
            expect(memos[0].items_id.toString()).equal(itemsId)
         })

         
      })

   })
