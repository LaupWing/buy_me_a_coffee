import type { NextApiRequest, NextApiResponse } from "next"
import "dotenv/config"
import pinataSdk from "@pinata/sdk"
import formidable from "formidable"
import fs from "fs"

export const config ={
   api: {
      bodyParser: false
   }
}

type Data = {
   url: string
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
      // @ts-ignore
      await pinata.pinFileToIPFS(fs.createReadStream(requestBody.files.profile.filepath), {
         pinataMetadata: {
            name: `profile_${requestBody.fields.account}`
         }
      })
      // @ts-ignore
      await pinata.pinFileToIPFS(fs.createReadStream(requestBody.files.thumbnail.filepath), {
         pinataMetadata: {
            name: `thumbnail_${requestBody.fields.account}`
         }
      })
      res.send({url:"ok"})
   }catch(e){
      console.log(e)
   }
}
