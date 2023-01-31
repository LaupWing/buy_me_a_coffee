import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { gateWay } from "../../../utils/ipfs"
import { fetchBuyMeACoffee } from "../../slices/contracts"
import { useAppDispatch } from "../../store/hooks"

const Campaign:NextPage = () => {
   const router = useRouter()
   const dispatch = useAppDispatch()
   const [campaign, setCampaign] = useState<any>(false)

   useEffect(() => {
      const init = async () =>{
         const buyMeACoffee = await dispatch(fetchBuyMeACoffee(router?.query!.address as string))
         const thumbnail = await buyMeACoffee.getThumbnail() 
         const profile = await buyMeACoffee.getProfile() 
         const name = await buyMeACoffee.getName() 
         const description = await buyMeACoffee.getDescription() 
         const listOfItems = await buyMeACoffee.getListOfItems() 
         console.log(listOfItems)

         setCampaign({
            thumbnail,
            profile,
            name,
            description
         })
         
      }
      init()
   },[])

   return (
      <div className="mt-6">
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
         <main className="mt-16">
            <div className="container flex flex-col space-y-4">
               <h1 className="display text-center text-neutral-800">{campaign.name}</h1>
               <p className="text-center">{campaign.description}</p>
            </div>
            <nav className="border-b-2 border-neutral-200 w-full flex mt-6">
               <ul className="mx-auto flex items-center space-x-12 font-semibold text-neutral-400">
                  <li className="border-b-[3px] border-yellow-400 text-yellow-400 pb-4">Home</li>
                  <li className="border-b-[3px] border-transparent pb-4">Supporters</li>
               </ul>
            </nav>
            <div className="w-full mt-6 shadow max-w-lg p-4 border border-neutral-300 rounded mx-auto">

            </div>
         </main>
      </div>
   )
}
export default Campaign