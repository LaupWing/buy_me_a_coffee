import { useEffect } from "react"
import useCampaign from "~/hooks/useCampaign"
import { MemoType, ItemsTypeFetched } from "../../../typings"

export const SupportersList = () => {
   const _campaign = useCampaign()

   useEffect(() => {
      const init = async () => {
         const memos = await _campaign.contract?.getMemos() 
         const listOfItems = await _campaign.contract?.getListOfItems()
         const memosWithItems = memos?.map((memo:MemoType) => {
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
