import { NextPage } from "next"
import { CampaignLayout, SupportersList } from "~/components"

const Supporters:NextPage = () => {
   return (
      <CampaignLayout>
         <SupportersList/>
      </CampaignLayout>
   )
}

export default Supporters