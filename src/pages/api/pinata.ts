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
   const test = await readFile(req)
   console.log(test)
   try{
      // @ts-ignore
      await pinata.pinFileToIPFS(fs.createReadStream(test.files.profile.filepath as string), {
         pinataMetadata: {
            name: "profile"
         }
      })
      // @ts-ignore
      await pinata.pinFileToIPFS(fs.createReadStream(test.files.profile.filepath as string), {
         pinataMetadata: {
            name: "thumbnail"
         }
      })
      res.send({url:"ok"})
   }catch(e){
      console.log(e)
   }
}
