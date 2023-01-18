import type { NextApiRequest, NextApiResponse } from "next"
import "dotenv/config"
import pinataSdk from "@pinata/sdk"

type Data = {
   url: string
}

const pinata = new pinataSdk(
   process.env.PINATA_API_KEY,
   process.env.PINATA_API_SECRET
)

export default function handler(
   req: NextApiRequest,
   res: NextApiResponse<Data>
) {
   console.log(req.body.file)
   console.log(req.body.name)
}
