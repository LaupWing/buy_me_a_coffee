import type { NextApiRequest, NextApiResponse } from "next"
import "dotenv/config"

type Data = {
   url: string
}

export default function handler(
   req: NextApiRequest,
   res: NextApiResponse<Data>
) {
   console.log(req.body)
}
