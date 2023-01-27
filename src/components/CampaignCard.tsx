import { FC } from "react"
import { BuyMeACoffeeType } from "../../typings"
import { gateWay } from "../../utils/ipfs"
import { ethers } from "ethers"
import { useAppSelector } from "../store/hooks"

const CampaignCard:FC<{campaign: BuyMeACoffeeType}> = ({ campaign }) => {
   const { account } = useAppSelector(state => state.web3)
   const owned = ethers.utils.getAddress(account) === ethers.utils.getAddress(campaign.owner)
   return (
      <div 
         className="bg-white relative shadow overflow-hidden flex flex-col rounded aspect-[5/4]"
         key={campaign.address}
      >
         {owned && <div className="absolute text-white px-4 py-0.5 rounded-md top-2 left-2 z-50 uppercase text-xs font-bold bg-yellow-400/50 backdrop-blur-lg">owned</div>}
         <div className="relative h-1/2 w-full">
            <img 
               src={gateWay + campaign.thumbnail} 
               alt="thumbnail" 
               className="h-full w-full object-center object-cover"
            />
            <img 
               src={gateWay + campaign.profile} 
               alt="profile" 
               className="absolute object-cover transform translate-y-1/3 border-4 border-neutral-100 w-20 h-20 rounded-full bottom-0 right-5"
            />
         </div>
         <div className="p-2 border-t-4 border-neutral-100 flex flex-col">
            <h2 className="text-yellow-400 font-bold">{campaign.name}</h2>
            <p className="leading-none line-clamp-4 mt-2">{campaign.description}</p>
         </div>
         
      </div>
   )
}
export default CampaignCard
