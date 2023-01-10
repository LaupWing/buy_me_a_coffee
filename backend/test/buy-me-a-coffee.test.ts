import { expect } from "chai"
import { deployments, ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../helper-hardhat-config"
import { BuyMeACoffee, MockV3Aggregator } from "../typechain-types"

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
         it("allows owner to add item to the contract", async () => {
            await buyMeACoffee.addItem(["cookies", "cappochino"], ethers.utils.parseEther("0.01"))
            const items = (await buyMeACoffee.getListOfItems())
            // expect()
            console.log(items[0].id.toString())
            console.log(items[0].names)
            console.log(items[0].cost.toString())
         })
      })


   })
