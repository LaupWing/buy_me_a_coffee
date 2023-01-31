import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import BuyMeACoffeeAbi from "../../../constants/contracts/BuyMeACoffee.json"
import { gateWay } from "../../../utils/ipfs"
import { fetchBuyMeACoffee } from "../../slices/contracts"
import { useAppDispatch } from "../../store/hooks"

const Campaign:NextPage = () => {
   const router = useRouter()
   const dispatch = useAppDispatch()
   const [campaign, setCampaign] = useState<any>(false)

   useEffect(() => {
      const init = async () =>{
         const test = await dispatch(fetchBuyMeACoffee(router?.query!.address as string))
         const thumbnail = await test.getThumbnail() 
         setCampaign({
            thumbnail
         })
         console.log()
      }
      init()
   },[])

   return (
      <div className="mt-6">
         <img 
            src={gateWay + campaign.thumbnail}  
            className="w-full h-60 object-cover"
            alt="thumbnail from campaign" 
         />
      </div>
   )
}
export default Campaign