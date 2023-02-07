import { 
   createContext, 
   FC, 
   PropsWithChildren, 
   useContext, 
   useState 
} from "react"
import { useRouter } from "next/router"
import { useAppDispatch } from "~/store/hooks"
import { fetchBuyMeACoffee } from "~/slices/contracts"
import { BuyMeACoffee } from "../../backend/typechain-types"
import { CampaignType } from "../../typings"

export interface CampaignContextInterface {
   loadCampaign: () => void
   loading: boolean
   contract: null|BuyMeACoffee
   campaign: null|CampaignType
} 

const CampaignContext = createContext<CampaignContextInterface>({
   loadCampaign: () => {},
   loading: false,
   campaign: null,
   contract: null
})

export const CampaignProvider:FC<PropsWithChildren> = ({ children }) =>{
   const router = useRouter()
   const dispatch = useAppDispatch()
   const [campaign, setCampaign] = useState<any>(false)
   const [contract, setContract] = useState<any>(null)
   const [loading, setLoading] = useState(true)

   const loadCampaign = async () =>{
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

   return (
      <CampaignContext.Provider 
         value={{
            loadCampaign,
            loading,
            campaign,
            contract
         }}
      >
         {children}
      </CampaignContext.Provider>
   )
}

export default () => {
   return useContext(CampaignContext)
}