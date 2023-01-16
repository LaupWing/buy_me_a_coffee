import { NextPage } from "next"
import { useRouter } from "next/router"
import Field from "../components/Field"
import { useAppSelector } from "../store/hooks"

const Create:NextPage = () => {
   const router = useRouter()
   const { alreadyRegistered } = useAppSelector(state => state.contracts)

   if(alreadyRegistered){
      router.push("/")
   }

   return (
      <div className="mt-10 container bg-white p-6 mx-auto rounded shadow">
         <form className="w-full space-y-8 max-w-lg">
            <Field
               inputValue=""
               label="Name"
            />
            <Field
               inputValue=""
               label="Description"
               textarea
            />
         </form>
      </div>
   )
}

export default Create