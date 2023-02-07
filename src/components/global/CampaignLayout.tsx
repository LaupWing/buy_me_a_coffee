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
import { gateWay } from "~/utils/ipfs"
import { CampaignProvider } from "~/hooks/useCampaign"

export const CampaignContext = createContext({
   campaign: null,
   contract: null,
   test: false,
   setTest: (test:boolean) => {},
   heh: (test:any) => {}
})

export const CampaignLayout:FC<PropsWithChildren> = ({children}) => {
   const router = useRouter()
   const dispatch = useAppDispatch()
   const [campaign, setCampaign] = useState<any>(false)
   const [contract, setContract] = useState<any>(null)
   const [loading, setLoading] = useState(true)
   const [test, setTest] = useState(true)

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

   const heh = () => {
      console.log("heh")
   }


   if(loading){
      return <div>Loading..</div>
   }
   return (
      <CampaignProvider>
         <div className="my-6 pb-10">
            <div className="relative">
               <img 
                  src={gateWay + campaign.thumbnail}  
                  className="w-full h-60 object-cover"
                  alt="thumbnail from campaign" 
               />
               <img 
                  className="absolute bottom-0 rounded-full overflow-hidden left-1/2 w-36 h-36 object-cover transform -translate-x-1/2 translate-y-1/3 border-[5px] border-white"
                  src={gateWay + campaign.profile} 
                  alt="profile picture" 
               />
            </div>
            <button onClick={() => setTest(!test)}>Test</button>
            {test? "true" : "false"}
            <main className="mt-16">
               <div className="container text-center flex flex-col space-y-2">
                  <h1 className="display text-center text-neutral-800">{campaign.name}</h1>
                  <p className="italic text-neutral-400 font-semibold">{campaign.owner}</p>
                  <p>{campaign.description}</p>
               </div>
               <nav className="border-b-2 border-neutral-200 w-full flex mt-6">
                  <ul className="mx-auto flex items-center space-x-12 font-semibold text-neutral-400">
                     <li className="border-b-[3px] border-yellow-400 text-yellow-400 pb-4">Home</li>
                     <li className="border-b-[3px] border-transparent pb-4">Supporters</li>
                  </ul>
               </nav>
               {children}
            </main>
         </div>
      </CampaignProvider>
   )
}

export const useCampaign = () => {
   return useContext(CampaignContext)
}