import { NextPage } from "next"
import { CampaignLayout, AddMemo } from "~/components"

const Campaign:NextPage = () => {
   return (
      <CampaignLayout>
         <AddMemo/>
      </CampaignLayout>
   )
}
export default Campaign