import { 
   createContext, 
   FC, 
   PropsWithChildren, 
   useCallback, 
   useContext, 
   useState 
} from "react"
import { useRouter } from "next/router"
import { useAppDispatch } from "~/store/hooks"
import { fetchBuyMeACoffee } from "~/slices/contracts"
import { BuyMeACoffee } from "../../backend/typechain-types"
import { CampaignType } from "types"

export interface CampaignContextInterface {
   loadCampaign: () => Promise<void>
   contract: null|BuyMeACoffee
   campaign: null|CampaignType
   loaded: boolean
} 

const CampaignContext = createContext<CampaignContextInterface>({
   loadCampaign: async () => {},
   campaign: null,
   contract: null,
   loaded: false
})

export const CampaignProvider:FC<PropsWithChildren> = ({ children }) =>{
   const router = useRouter()
   const dispatch = useAppDispatch()
   const [campaign, setCampaign] = useState<any>(false)
   const [contract, setContract] = useState<any>(null)
   const [loaded, setLoaded] = useState(false)
   const [prevRoute, setPrevRoute] = useState("")
   
   if(loaded 
      && router.query.address 
      && (prevRoute !== router.query.address))
   {
      setLoaded(false)
   }

   const loadCampaign = useCallback(async () =>{
      const _contract = await dispatch(fetchBuyMeACoffee(router?.query!.address as string))
      const thumbnail = await _contract.getThumbnail() 
      const profile = await _contract.getProfile() 
      const name = await _contract.getName() 
      const owner = await _contract.getOwner() 
      const description = await _contract.getDescription() 
      const listOfItems = await _contract.getListOfItems()
      console.log(await _contract.getMemos())
      
      setPrevRoute(router.query.address! as string)
      setCampaign({
         thumbnail,
         profile,
         name,
         description,
         listOfItems,
         owner
      })
      setContract(_contract)
      setLoaded(true)
   }, [router?.query!.address])

   return (
      <CampaignContext.Provider 
         value={{
            loadCampaign,
            campaign,
            contract,
            loaded
         }}
      >
         {children}
      </CampaignContext.Provider>
   )
}

export default () => {
   return useContext(CampaignContext)
}