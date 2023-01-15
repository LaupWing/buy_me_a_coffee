import "dotenv/config"
import fs from "fs"

export default async function updateFrontend() {
   if(process.env.UPDATE_FRONTEND === "true"){
      console.log("Updating frontend...")
      await updateAbi()
      await updateContractAddresses()
   }
}



const updateAbi = async () =>{
   
}

const updateContractAddresses = async () =>{

}