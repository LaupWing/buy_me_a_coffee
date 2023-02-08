import { useEffect } from "react"
import useCampaign from "~/hooks/useCampaign"
import { MemoType } from "../../../typings"

export const SupportersList = () => {
   const _campaign = useCampaign()

   useEffect(() => {
      const init = async () => {
         const memos = await _campaign.contract?.getMemos() 
         const listOfItems = await _campaign.contract?.getListOfItems()
         // const memosWithItems = memos?.map((memo:MemoType) => {

         // })
         console.log(listOfItems)
      }

      init()
   }, [])

   return (
      <ul className="mx-auto w-full mt-6 max-w-lg bg-white border shadow rounded">
         {}
      </ul>
   )
}
