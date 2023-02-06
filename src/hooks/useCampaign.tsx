import { createContext, FC, PropsWithChildren, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAppDispatch } from "~/store/hooks"
import { fetchBuyMeACoffee } from "~/slices/contracts"
import { gateWay } from "~/utils/ipfs"

const CampaignContext = createContext({

})

export const CampaignProvider:FC<PropsWithChildren> = ({ children }) =>{
   const router = useRouter()
   const dispatch = useAppDispatch()
   const [campaign, setCampaign] = useState<any>(false)
   const [contract, setContract] = useState<any>(null)
   const [loading, setLoading] = useState(true)
   const [test, setTest] = useState(true)

   useEffect(() => {
      const init = async () =>{
         const _contract = await dispatch(fetchBuyMeACoffee(router?.query!.address as string))
         const thumbnail = await _contract.getThumbnail() 
         const profile = await _contract.getProfile() 
         const name = await _contract.getName() 
         const owner = await _contract.getOwner() 
         const description = await _contract.getDescription() 
         const listOfItems = await _contract.getListOfItems()
         
         setCampaign({
            thumbnail,
            profile,
            name,
            description,
            listOfItems,
            owner
         })
         setContract(_contract)
         setLoading(false)
      }
      init()
   },[])

   return (
      <CampaignContext.Provider value={{
         test
      }}>
         {children}
      </CampaignContext.Provider>
   )
}