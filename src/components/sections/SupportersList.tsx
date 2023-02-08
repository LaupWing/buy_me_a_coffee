import { useEffect, useState } from "react"
import useCampaign from "~/hooks/useCampaign"
import { MemoType, MemoTypeWithItems } from "../../../typings"

export const SupportersList = () => {
   const _campaign = useCampaign()
   const [memos, setMemos] = useState<MemoTypeWithItems[]>([])

   useEffect(() => {
      const init = async () => {
         const _memos = await _campaign.contract?.getMemos() 
         const listOfItems = await _campaign.contract?.getListOfItems()
         const memosWithItems = _memos?.map((memo:MemoType) => {
            return {
               ...memo,
               items: listOfItems?.find((x: any) => x.id.eq(memo.items_id) )
            }
         })
         console.log(memosWithItems)
      }

      init()
   }, [])

   return (
      <ul className="mx-auto w-full mt-6 max-w-lg bg-white border shadow rounded">
         {}
      </ul>
   )
}
