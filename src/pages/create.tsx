import { NextPage } from "next"
import { useRouter } from "next/router"
import { useAppSelector } from "../store/hooks"

const Create:NextPage = () => {
   const router = useRouter()
   const { alreadyRegistered } = useAppSelector(state => state.contracts)

   if(alreadyRegistered){
      router.push("/")
   }

   return (
      <div>

      </div>
   )
}

export default Create