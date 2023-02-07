import { NextPage } from "next"
import { CampaignLayout, Memo } from "~/components"

const Campaign:NextPage = () => {
   return (
      <CampaignLayout>
         <Memo/>
      </CampaignLayout>
   )
}
export default Campaign