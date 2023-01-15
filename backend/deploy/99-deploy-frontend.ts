import "dotenv/config"
import fs from "fs"
import { ethers, network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { frontendContractAbi, frontendContractAddresses } from "../helper-hardhat-config"

const updateFrontend:DeployFunction = async () => {
   if(process.env.UPDATE_FRONTEND === "true"){
      console.log("Updating frontend...")
      await updateAbi()
      await updateContractAddresses()
   }
}

export default updateFrontend

const updateAbi = async () =>{
   const buyMeACoffeeFactory = await ethers.getContract("BuyMeACoffeeFactory")
   fs.writeFileSync(
      `${frontendContractAbi}/BuyMeACoffeeFactory.json`,
      buyMeACoffeeFactory.format(ethers.utils.FormatTypes.json)
   )
   const buyMeACoffee = await ethers.getContract("BuyMeACoffee")
   fs.writeFileSync(
      `${frontendContractAbi}/BuyMeACoffee.json`,
      buyMeACoffee.format(ethers.utils.FormatTypes.json)
   )
}

const updateContractAddresses = async () =>{
   const chainId = network.config.chainId?.toString()
   const buyMeACoffeeFactory = await ethers.getContract("BuyMeACoffeeFactory")
   const contractAddresses = JSON.parse(fs.readFileSync(frontendContractAddresses, "utf-8"))

   if(chainId){
      if(chainId in contractAddresses){
         if(!contractAddresses[chainId]["BuyMeACoffeeFactory"].includes(buyMeACoffeeFactory.address)){
            contractAddresses[chainId]["BuyMeACoffeeFactory"].push(buyMeACoffeeFactory.address)
         }
      }else {
         contractAddresses[chainId] = {
            "BuyMeACoffeeFactory": [buyMeACoffeeFactory.address]
         }
      }
      fs.writeFileSync(frontendContractAddresses, JSON.stringify(contractAddresses, null, 3))
   }
}

updateFrontend.tags = ["all", "frontend"]