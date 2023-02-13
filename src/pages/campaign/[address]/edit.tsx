import { NextPage } from "next"
import { useEffect } from "react"
import { CampaignLayout, AddMemo } from "~/components"
import useCampaign from "~/hooks/useCampaign"
import { gateWay } from "~/utils/ipfs"

const Campaign:NextPage = () => {
   const _campaign = useCampaign()

   useEffect(() => {
      const init = async () =>{
         await _campaign.loadCampaign()
      }
      init()
   },[])

   if(!_campaign.loaded){
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
            <div className="w-full max-w-md mx-auto text-center flex flex-col space-y-4">
               <input 
                  type="text" 
                  value={_campaign.campaign?.name}
               />
               <p className="italic text-neutral-400 font-semibold">{_campaign.campaign?.owner}</p>
               <textarea 
                  className="h-32 resize-none"
                  value={_campaign.campaign?.description}
               />
            </div>
         </main>
      </div>
   )
}
export default Campaign