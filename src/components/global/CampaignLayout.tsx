import {
   useEffect,
   FC, 
   useState,
   PropsWithChildren,
   memo
} from "react"
import { gateWay } from "~/utils/ipfs"
import useCampaign from "~/hooks/useCampaign"
import Link from "next/link"
import { useRouter } from "next/router"
import isOwner from "~/utils/compareAddress"
import { useAppSelector } from "~/store/hooks"


export const CampaignLayout:FC<PropsWithChildren> = memo(({children}) => {
   const router = useRouter()
   const _campaign = useCampaign()
   const { account } = useAppSelector(state => state.web3)

   // const owner = isOwner(account, _campaign.campaign?.address!)

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
            {true && <button className="absolute top-3 left-2 btn">Edit</button>}
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
                  <Link 
                     href={{
                        pathname: `/campaign/[address]`,
                        query: {
                           address: router.query.address
                        }
                     }}
                  >
                     <li 
                        className={"border-b-[3px] pb-4 " + (
                           router.pathname === "/campaign/[address]" 
                              ? "border-yellow-400 text-yellow-400"
                              : "border-transparent"
                        )}
                     >
                        Home
                     </li>
                  </Link>
                  <Link
                     href={{
                        pathname: `/campaign/[address]/supporters`,
                        query: {
                           address: router.query.address
                        }
                     }}
                  >
                     <li 
                        className={"border-b-[3px] border-transparent pb-4 " +(
                           router.pathname === "/campaign/[address]/supporters" 
                              ? "border-yellow-400 text-yellow-400"
                              : "border-transparent"
                        )}
                     >
                        Supporters
                     </li>
                  </Link>
               </ul>
            </nav>
            {children}
         </main>
      </div>
   )
})