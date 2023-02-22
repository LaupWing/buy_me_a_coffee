import { useState } from "react"
import { HashLoader } from "react-spinners"
import { toast } from "react-toastify"
import useCampaign from "~/hooks/useCampaign"
import { IconEthereum } from "./Icons"

export const WithdrawButton = () => {
   const _campaign = useCampaign()
   const [loading, setLoading] = useState(false)

   const withdraw = async () =>{
      setLoading(true)
      const transaction = await _campaign.contract?.withdraw()
      await transaction?.wait()
      setLoading(false)
      toast("Withdraw success!")
   }

   return (
      <button 
         className="mx-auto mt-10 bg-indigo-500 hover:bg-indigo-600 text-white shadow rounded uppercase font-bold w-44 h-10 text-xl tracking-wider flex items-center justify-center"
         onClick={withdraw}
      >
         {loading ? (
            <HashLoader size={20} color="white"/>
         ) : (
            <>
               {_campaign.campaign?.balance} <IconEthereum className="ml-2"/>
            </>
         )}
      </button>
   )
}