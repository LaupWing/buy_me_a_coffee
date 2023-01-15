import "dotenv/config"
import fs from "fs"
import { ethers } from "hardhat"
import { frontendContractAbi } from "../helper-hardhat-config"

export default async function updateFrontend() {
   if(process.env.UPDATE_FRONTEND === "true"){
      console.log("Updating frontend...")
      await updateAbi()
      await updateContractAddresses()
   }
}



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

}