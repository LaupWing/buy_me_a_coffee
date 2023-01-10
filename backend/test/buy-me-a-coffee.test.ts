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
         mockV3Aggregator: MockV3Aggregator

      beforeEach(async () => { 
         const accounts = await getNamedAccounts()
         await deployments.fixture(["all"])
         buyMeACoffee = await ethers.getContract("BuyMeACoffee")
         mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
         deployer = accounts.deployer
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
            expect(items[0].names).to.have.members(firstSetOfItems)
            expect(items[0].cost.toString()).equal(ethers.utils.parseEther("0.01"))
         })

         it("allows owner to add item to the contract", async () => {
            expect(items[0].id.toString()).equal("0")
            expect(items[0].names).to.have.members(["cookies", "cappochino"])
            expect(items[0].cost.toString()).equal(ethers.utils.parseEther("0.01"))
         })
      })


   })
