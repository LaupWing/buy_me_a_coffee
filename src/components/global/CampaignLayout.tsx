import {
   useEffect,
   FC, 
   useState,
   PropsWithChildren,
} from "react"
import { gateWay } from "~/utils/ipfs"
import useCampaign from "~/hooks/useCampaign"


export const CampaignLayout:FC<PropsWithChildren> = ({children}) => {
   const _campaign = useCampaign()
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      const init = async () =>{
         await _campaign.loadCampaign()
         setLoading(false)
      }
      init()
   },[])


   if(loading){
      return <div>Loading..</div>
   }
   return (
      <div className="my-6 pb-10">
         <div className="relative">
            <img 
               src={gateWay + _campaign.campaign?.thumbnail}  
               className="w-full h-60 object-cover"
               alt="thumbnail from campaign" 
            />
            <img 
               className="absolute bottom-0 rounded-full overflow-hidden left-1/2 w-36 h-36 object-cover transform -translate-x-1/2 translate-y-1/3 border-[5px] border-white"
               src={gateWay + _campaign.campaign?.profile} 
               alt="profile picture" 
            />
         </div>
         <main className="mt-16">
            <div className="container text-center flex flex-col space-y-2">
               <h1 className="display text-center text-neutral-800">{_campaign.campaign?.name}</h1>
               <p className="italic text-neutral-400 font-semibold">{_campaign.campaign?.owner}</p>
               <p>{_campaign.campaign?.description}</p>
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
   )
}