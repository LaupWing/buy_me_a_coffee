import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { ITEMS } from "../../../constants"
import { gateWay } from "../../../utils/ipfs"
import { fetchBuyMeACoffee } from "../../slices/contracts"
import { ethers } from "ethers"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { FaEthereum } from "react-icons/fa"

const Campaign:NextPage = () => {
   const router = useRouter()
   const dispatch = useAppDispatch()
   const [campaign, setCampaign] = useState<any>(false)
   const findItem = (item:string) => ITEMS.find(x => x.name === item)?.emoji || 0
   const { ethPrice } = useAppSelector(state => state.contracts)

   useEffect(() => {
      const init = async () =>{
         const buyMeACoffee = await dispatch(fetchBuyMeACoffee(router?.query!.address as string))
         const thumbnail = await buyMeACoffee.getThumbnail() 
         const profile = await buyMeACoffee.getProfile() 
         const name = await buyMeACoffee.getName() 
         const description = await buyMeACoffee.getDescription() 
         const listOfItems = await buyMeACoffee.getListOfItems()
         
         setCampaign({
            thumbnail,
            profile,
            name,
            description,
            listOfItems
         })
         
      }
      init()
   },[])

   console.log(campaign)

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
            <div className="w-full mt-6 shadow max-w-lg p-4 border border-neutral-300 rounded mx-auto bg-white">
               <h3 className="text-3xl font-semibold mb-8 text-neutral-600 tracking-tight">Buy {campaign.name} a treat!</h3>
               {campaign && (
                  <ul className="flex flex-col space-y-2">
                     {campaign.listOfItems.map((listOfItem:any) => (
                        <li 
                           className="flex items-center justify-between rounded bg-yellow-400/5 p-3 border-2 border-yellow-400/30"
                           key={listOfItem.id.toString()}
                        >
                           <div className="flex items-center text-3xl">
                              {listOfItem.names.map((item:any) => String.fromCodePoint(findItem(item)))}
                           </div>
                           <div className="flex items-center text-lg">
                              <div className="flex items-center text-neutral-400 font-bold space-x-1">
                                 <p>{ethers.utils.formatEther(listOfItem.cost).toString()}</p>
                                 <FaEthereum/>
                              </div>
                              <div className="w-14 flex justify-end items-center text-neutral-300 font-bold space-x-1">
                                 <p>$ {
                                    Number(ethers.utils.formatEther(listOfItem.cost).toString()) * ethPrice
                                 }</p>
                              </div>
                           </div>
                        </li>
                     ))}
                  </ul>
               )}
               <div className="my-4 space-y-4">
                  <input 
                     type="text" 
                     className="w-full bg-neutral-200/40 p-2 border-2 border-neutral-200 rounded"
                  />
                  <textarea className="w-full h-44 resize-none bg-neutral-200/40 p-2 border-2 border-neutral-200 rounded">

                  </textarea>
               </div>
            </div>
         </main>
      </div>
   )
}
export default Campaign

const Item = () =>{
   return (
      <li>
         
      </li>
   )
}