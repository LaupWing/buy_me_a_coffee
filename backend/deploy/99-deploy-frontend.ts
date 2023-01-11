import "dotenv/config"


export default async function updateFrontend() {
   if(process.env.UPDATE_FRONTEND === "true"){
      console.log("Updating frontend...")
   }
}