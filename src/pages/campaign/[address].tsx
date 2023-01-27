import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"
import BuyMeACoffeeAbi from "../../../constants/contracts/BuyMeACoffee.json"
import { fetchBuyMeACoffee } from "../../slices/contracts"
import { useAppDispatch } from "../../store/hooks"

const Campaign:NextPage = () => {
   const router = useRouter()
   const dispatch = useAppDispatch()

   useEffect(() => {
      const init = async () =>{
         const test = await dispatch(fetchBuyMeACoffee(router?.query!.address as string))
         console.log(await test.getDescription())
      }
      init()
   },[])

   return (
      <div className="container mt-6">Campaign</div>
   )
}
export default Campaign