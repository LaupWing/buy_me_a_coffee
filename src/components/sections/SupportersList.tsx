import useCampaign from "~/hooks/useCampaign"

export const SupportersList = () => {
   const _campaign = useCampaign()
   console.log(_campaign)

   return (
      <div className="mx-auto w-full mt-6 max-w-lg">Supporters</div>
   )
}
