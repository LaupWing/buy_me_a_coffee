import useCampaign from "~/hooks/useCampaign"
import { IconEthereum } from "./Icons"

export const WithdrawButton = () => {
   const _campaign = useCampaign()

   return (
      <button className="mx-auto mt-10 bg-indigo-500 hover:bg-indigo-600 text-white shadow rounded uppercase font-bold w-44 py-1.5 text-xl tracking-wider flex items-center justify-center">
         {_campaign.campaign?.balance} <IconEthereum className="ml-2"/>
      </button>
   )
}