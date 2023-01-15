import "dotenv/config"
import fs from "fs"
import { ethers } from "hardhat"

export default async function updateFrontend() {
   if(process.env.UPDATE_FRONTEND === "true"){
      console.log("Updating frontend...")
      await updateAbi()
      await updateContractAddresses()
   }
}



const updateAbi = async () =>{
   const buyMeACoffee = await ethers.getContract("BuyMeACoffeeFactory")
   // fs.writeFileSync(
   //    ``,
   // )
}

const updateContractAddresses = async () =>{

}