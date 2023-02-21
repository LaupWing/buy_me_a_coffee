import type { NextApiRequest, NextApiResponse } from "next"
import "dotenv/config"
import pinataSdk, { PinataPinResponse } from "@pinata/sdk"
import formidable from "formidable"
import fs from "fs"

export const config ={
   api: {
      bodyParser: false
   }
}

type Data = {
   profileUri: PinataPinResponse | boolean
   thumbnailUri: PinataPinResponse | boolean
}

const pinata = new pinataSdk(
   process.env.PINATA_API_KEY,
   process.env.PINATA_API_SECRET
)

const readFile = (req: NextApiRequest) : Promise<{fields: formidable.Fields, files: formidable.Files}> => {
   const form = new formidable.IncomingForm({
      multiples: true
   })
   return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
         if(err) reject(err)
         resolve({
            fields, 
            files
         })
      })
   })
}

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<Data>
) {
   const requestBody = await readFile(req)
   
   try{
      let profileUri = false
      let thumbnailUri = false
      // @ts-ignore
      if(requestBody.files?.profile?.filepath){
         // @ts-ignore
         profileUri = await pinata.pinFileToIPFS(fs.createReadStream(requestBody.files.profile.filepath), {
            pinataMetadata: {
               name: `profile_${requestBody.fields.account}`
            }
         })
      }
      // @ts-ignore
      if(requestBody.files?.thumbnail?.filepath){
         // @ts-ignore
         thumbnailUri = await pinata.pinFileToIPFS(fs.createReadStream(requestBody.files.thumbnail.filepath), {
            pinataMetadata: {
               name: `thumbnail_${requestBody.fields.account}`
            }
         })
      }
      res.send({
         thumbnailUri,
         profileUri
      })
   }catch(e){
      console.log(e)
   }
}
