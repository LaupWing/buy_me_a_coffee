import { expect } from "chai"
import { ethers, getNamedAccounts, network } from "hardhat"
import { developmentChains } from "../helper-hardhat-config"

!developmentChains.includes(network.name)
   ? describe.skip
   : describe("BuyMeACoffee", () => {
      let buyMeACoffee, 
         deployer:string, mockV3Aggregator

      beforeEach(async () => { 
         const accounts = await getNamedAccounts()
         deployer = accounts.deployer
      })

      it("sets up starting values correctly", async () => {
         console.log(deployer)
      })
   })
