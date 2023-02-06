import { 
   useState, 
   useEffect, 
   createContext, 
   FC, 
   PropsWithChildren, 
   useContext,
   useMemo
} from "react"
import { useRouter } from "next/router"
import { useAppDispatch } from "~/store/hooks"
import { BuyMeACoffee } from "../../../backend/typechain-types"
import { fetchBuyMeACoffee } from "~/slices/contracts"

const CampaignContext = createContext({
   campaign: null
})

export const CampaignLayout:FC<PropsWithChildren> = ({children}) => {
   const router = useRouter()
   const dispatch = useAppDispatch()
   const [campaign, setCampaign] = useState<any>(false)
   const [contract, setContract] = useState<BuyMeACoffee|null>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const init = async () =>{
         const _contract = await dispatch(fetchBuyMeACoffee(router?.query!.address as string))
         const thumbnail = await _contract.getThumbnail() 
         const profile = await _contract.getProfile() 
         const name = await _contract.getName() 
         const owner = await _contract.getOwner() 
         const description = await _contract.getDescription() 
         const listOfItems = await _contract.getListOfItems()
         
         setCampaign({
            thumbnail,
            profile,
            name,
            description,
            listOfItems,
            owner
         })
         setContract(_contract)
         setLoading(false)
      }
      init()
   },[])

   const value = useMemo(() => ({
      campaign,
      contract
   }), [router?.query!.address])

   if(loading){
      return <div>Loading..</div>
   }
 
   return (
      <CampaignContext.Provider 
         value={value}
      >
         {children}  
      </CampaignContext.Provider>
   )
}

export const useCampaign = () => {
   return useContext(CampaignContext)
}