import { 
   useState, 
   useEffect, 
   createContext, 
   FC, 
   PropsWithChildren 
} from "react"
import { useRouter } from "next/router"
import { useAppDispatch } from "~/store/hooks"
import { BuyMeACoffee } from "../../../backend/typechain-types"
import { fetchBuyMeACoffee } from "~/slices/contracts"

const CampaignContext = createContext({
   campaign: null
})

export const CampaignLayout:FC<PropsWithChildren> = () => {
   const router = useRouter()
   const dispatch = useAppDispatch()
   const [campaign, setCampaign] = useState<any>(false)
   const [buyMeACoffee, setBuyMeACoffee] = useState<BuyMeACoffee|null>(null)

   useEffect(() => {
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

   return (
      <div>CampaignLayout</div>
   )
}