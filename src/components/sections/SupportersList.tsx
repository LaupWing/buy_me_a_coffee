import { useEffect, useState, FC } from "react"
import useCampaign from "~/hooks/useCampaign"
import { MemoType, MemoTypeWithItems } from "types"
import { Items } from "~/components"
import { ethers } from "ethers"
import { useAppSelector } from "~/store/hooks"
import { useForm } from "react-hook-form"

export const SupportersList = () => {
   const _campaign = useCampaign()
   const [memos, setMemos] = useState<MemoTypeWithItems[]>([])

   const fetchMemos = async () => {
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
   
   useEffect(() => {
      fetchMemos()
   }, [])
   
   return (
      <ul className="mx-auto divide-y w-full mt-6 max-w-lg bg-white border shadow rounded">
         <li className="p-2 text-yellow-400 font-bold">Total supported: ({memos.length})</li>
         {memos.map((memo:MemoTypeWithItems, i: number) => (
            <Memo
               key={i}
               memo={memo}
            />
         ))}
      </ul>
   )
}


interface MemoProps {
   memo: MemoTypeWithItems
}

interface FormValues {
   repsonse: string
}

const Memo:FC<MemoProps> = ({
   memo
}) => {
   const _campaign = useCampaign()
   const { account } = useAppSelector(state => state.web3)
   const isOwner = ethers.utils.getAddress(_campaign.campaign?.owner!) === ethers.utils.getAddress(account)
   const [showReply, setShowReply] = useState(false)

   const {
      register,
      handleSubmit,
      formState:{
         errors
      }
   } = useForm<FormValues>({
      defaultValues:{
         repsonse: ""
      }
   })
   
   const submitHandler = () => {

   }

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
         {(isOwner || !showReply) ? (
            <button 
               className="text-xs uppercase font-bold text-right mr-2 text-yellow-400"
               onClick={() => setShowReply(true)}
            >
               Reply
            </button>
         ) : (
            <form 
               className="flex flex-col"
               onSubmit={handleSubmit(submitHandler)}
            >
               <div className="flex space-x-1">
                  <button 
                     className="btn-hollow"
                     onClick={() => setShowReply(false)}
                  >
                     cancel
                  </button>
                  <input 
                     type="text" 
                     className="p-1 px-2 rounded border-neutral-300 bg-neutral-50 placeholder:text-gray-300 flex-1"
                     placeholder="Reply to comment"
                     {...register("repsonse", {
                        required: "You need to fill in something!"
                     })}
                  />
                  <button className="btn">Reply</button>
               </div>
               {errors.repsonse && (
                  <p className="error mt-2">{errors.repsonse.message}</p>
               )}
            </form>
         )}
      </li>
   )
}