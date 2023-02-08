import { useEffect, useState } from "react"
import useCampaign from "~/hooks/useCampaign"
import { MemoType, MemoTypeWithItems } from "types"
import { Items } from "~/components"
import { ethers } from "ethers"

export const SupportersList = () => {
   const _campaign = useCampaign()
   const [memos, setMemos] = useState<MemoTypeWithItems[]>([])

   useEffect(() => {
      const init = async () => {
         const _memos = await _campaign.contract?.getMemos() 
         const listOfItems = await _campaign.contract?.getListOfItems()
         console.log(listOfItems)
         const memosWithItems:any = _memos?.map((memo:MemoType) => {
            return {
               ...memo,
               items: listOfItems?.find((x: any) => x.id.eq(memo.items_id) )
            }
         })
         setMemos(memosWithItems)
      }

      init()
   }, [])

   return (
      <ul className="mx-auto w-full mt-6 max-w-lg bg-white border shadow rounded">
         {memos.map((memo:MemoTypeWithItems) => (
            <li 
               className="flex flex-col"
               key={memo.timestamp.toString()}
            >
               <p>{memo.from}</p>
               <ul>
                  <Items 
                     value={Number(ethers.utils.formatEther(memo.items.cost))} 
                     items={memo.items.names}
                  />    
               </ul>
            </li>
         ))}
      </ul>
   )
}
