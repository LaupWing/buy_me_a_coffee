import { run } from "hardhat"


const verify = async (contract_address:string, args:any[]) => {
   console.log("Verifying contract...")
   try {
      await run("verify:verify", {
         address: contract_address,
         constructorArguments: args
      })
   } catch (e:any) {
      if (e.message.toLowerCase().includes("already verified")) {
         console.log("Already verified!")
      }else{
         console.log(e)
      }
   }
}

module.exports = {
   verify
}