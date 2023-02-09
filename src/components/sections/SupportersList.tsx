import { useEffect, useState, FC } from "react"
import useCampaign from "~/hooks/useCampaign"
import { MemoType, MemoTypeWithItems } from "types"
import { Items } from "~/components"
import { ethers } from "ethers"
import { useAppSelector } from "~/store/hooks"

export const SupportersList = () => {
   const _campaign = useCampaign()
   const [memos, setMemos] = useState<MemoTypeWithItems[]>([])
   const { account } = useAppSelector(state => state.web3)
   const isOwner = ethers.utils.getAddress(_campaign.campaign?.owner!) === ethers.utils.getAddress(account)

   useEffect(() => {
      const init = async () => {
         const _memos = await _campaign.contract?.getMemos() 
         const listOfItems = await _campaign.contract?.getListOfItems()
         
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
      <ul className="mx-auto divide-y w-full mt-6 max-w-lg bg-white border shadow rounded">
         <li className="p-2 text-yellow-400 font-bold">Total supported: ({memos.length})</li>
         {memos.map((memo:MemoTypeWithItems) => (
            <li 
               className="flex flex-col p-2"
               key={memo.timestamp.toString()}
            >
               <p 
                  className={"font-bold text-xs " + (
                     ethers.utils.getAddress(memo.from) === ethers.utils.getAddress(account) 
                        ? "text-yellow-400/60"
                        : "text-neutral-300"
                  )}
               >
                  {memo.from}
               </p>
               <ul>
                  <Items 
                     value={Number(ethers.utils.formatEther(memo.items.cost))} 
                     items={memo.items.names}
                  />    
               </ul>
               <div className="flex flex-col p-4">
                  <p className="font-bold text-neutral-400">{memo.name}</p>
                  <p>{memo.message}</p>
               </div>
               {isOwner && (
                  <button className="text-xs uppercase font-bold text-right mr-2 text-yellow-400">
                     Reply
                  </button>
               )}
            </li>
         ))}
      </ul>
   )
}


interface MemoProps {
   memo: MemoTypeWithItems
}

const Memo:FC<MemoProps> = ({
   memo
}) => {
   const _campaign = useCampaign()
   const { account } = useAppSelector(state => state.web3)
   const isOwner = ethers.utils.getAddress(_campaign.campaign?.owner!) === ethers.utils.getAddress(account)

   return (
      <li 
         className="flex flex-col p-2"
         key={memo.timestamp.toString()}
      >
         <p 
            className={"font-bold text-xs " + (
               ethers.utils.getAddress(memo.from) === ethers.utils.getAddress(account) 
                  ? "text-yellow-400/60"
                  : "text-neutral-300"
            )}
         >
            {memo.from}
         </p>
         <ul>
            <Items 
               value={Number(ethers.utils.formatEther(memo.items.cost))} 
               items={memo.items.names}
            />    
         </ul>
         <div className="flex flex-col p-4">
            <p className="font-bold text-neutral-400">{memo.name}</p>
            <p>{memo.message}</p>
         </div>
         {isOwner && (
            <button className="text-xs uppercase font-bold text-right mr-2 text-yellow-400">
               Reply
            </button>
         )}
      </li>
   )
}