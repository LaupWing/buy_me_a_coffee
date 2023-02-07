import { NextPage } from "next"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { gateWay } from "~/utils/ipfs"
import { fetchBuyMeACoffee } from "~/slices/contracts"
import { useAppDispatch } from "~/store/hooks"
import { CampaignLayout, Memo } from "~/components"
import { BuyMeACoffee } from "../../../backend/typechain-types"
import { CampaignContext } from "~/components/global/CampaignLayout"
import useCampaign from "~/hooks/useCampaign"

const Campaign:NextPage = () => {
   const router = useRouter()
   const dispatch = useAppDispatch()
   const [campaign, setCampaign] = useState<any>(false)
   const [buyMeACoffee, setBuyMeACoffee] = useState<BuyMeACoffee|null>(null)
   const test = useCampaign()

   useEffect(() => {
      console.log(test)
      const init = async () =>{
         const buyMeACoffee = await dispatch(fetchBuyMeACoffee(router?.query!.address as string))
         const thumbnail = await buyMeACoffee.getThumbnail() 
         const profile = await buyMeACoffee.getProfile() 
         const name = await buyMeACoffee.getName() 
         const owner = await buyMeACoffee.getOwner() 
         const description = await buyMeACoffee.getDescription() 
         const listOfItems = await buyMeACoffee.getListOfItems()
         
         setCampaign({
            thumbnail,
            profile,
            name,
            description,
            listOfItems,
            owner
         })
         setBuyMeACoffee(buyMeACoffee)
      }
      init()
   },[])

   const storeMemo = async (items: string, message: string, name: string) =>{
      buyMeACoffee!.storeMemo(name, message, items, {
         value: campaign.listOfItems.find((x:any) => items === x.id.toString()).cost.toString()
      })
   }

   return (
      <CampaignLayout>
         <Memo 
            campaign={campaign}
            storeMemo={storeMemo}
         />
      </CampaignLayout>
   )
}
export default Campaign