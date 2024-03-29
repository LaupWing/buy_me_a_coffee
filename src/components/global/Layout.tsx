import { 
   useEffect, 
   useState, 
   FC, 
   PropsWithChildren 
} from "react"
import { connectWallet, loadAccount, loadWeb3 } from "~/slices/web3"
import { IconCoffee, IconSearch } from "~/components"
import { useAppDispatch, useAppSelector } from "~/store/hooks"
import { 
   fetchBuyMeACoffeeFactory, 
   fetchCampaigns, 
   fetchEthPrice, 
   setInitialBuyMeACoffeeFactory 
} from "~/slices/contracts"
import Link from "next/link"

export const Layout:FC<PropsWithChildren> = ({children}) => {
   const dispatch = useAppDispatch()
   const { account } = useAppSelector(state => state.web3)
   const { 
      alreadyRegistered, 
      buyMeACoffeeFactory, 
      campaigns,
      myCampaignAddress
   } = useAppSelector(state => state.contracts)
   const [loaded, setLoaded] = useState(false)

   useEffect(()=>{
      const initialize = async () =>{
         await dispatch(loadWeb3())
         await dispatch(loadAccount())
         setLoaded(true)
      }

      initialize()
   }, [])

   const attachEvents = () =>{
      buyMeACoffeeFactory?.on("BuyMeACoffeeCreated", async (e:any) => {
         if(!campaigns.find(x => x.address === e)){
            
         }
      })
   }

   useEffect(() => {
      const fetchContracts = async () => {
         await dispatch(fetchBuyMeACoffeeFactory())
         await dispatch(setInitialBuyMeACoffeeFactory())
         await dispatch(fetchCampaigns())
         await dispatch(fetchEthPrice())
         attachEvents()
      }
      if(account){
         fetchContracts()
      }
   }, [account])

   return (
      <div className="w-screen h-screen overflow-y-auto min-h-0 fixed inset-0 bg-neutral-100 flex flex-col">
         {loaded ? (
            <>
               <header className="bg-white container p-4 flex rounded-lg shadow mt-4">
                  <Link href={"/"}>
                     <div className="text-neutral-700">
                        <IconCoffee size={30}/>
                     </div>
                  </Link>
                  <div className="flex items-center ml-auto space-x-6">
                     { account ? (
                        <>
                           <IconSearch
                              className="text-gray-400 hover:text-yellow-400 duration-200 cursor-pointer" 
                              size={30}
                           />
                           { alreadyRegistered ? (
                              <Link href={`/campaign/${myCampaignAddress}`}>
                                 <button 
                                    className="btn"
                                 >
                                    My Coffees
                                 </button>
                              </Link>
                           ) :(
                              <Link href={"/create"}>
                                 <button 
                                    className="btn"
                                    onClick={()=> dispatch(setInitialBuyMeACoffeeFactory())}
                                 >
                                    Create
                                 </button>
                              </Link>
                           ) }
                        </>
                     ) : (
                        <button 
                           className="btn"
                           onClick={() => dispatch(connectWallet())}
                        >
                           connect
                        </button>
                     )}
                  </div>
               </header>
               {children}
            </>
         ): (
            <div>Loading...</div>
         )}
      </div>
   )
}