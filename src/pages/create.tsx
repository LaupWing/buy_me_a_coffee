import { NextPage } from "next"
import { useRouter } from "next/router"
import Field from "../components/Field"
import { useAppSelector } from "../store/hooks"
import { BsCardImage } from "react-icons/bs"

const Create:NextPage = () => {
   const router = useRouter()
   const { alreadyRegistered } = useAppSelector(state => state.contracts)

   if(alreadyRegistered){
      router.push("/")
   }

   return (
      <div className="mt-10 container bg-white p-6 mx-auto rounded shadow">
         <form className="w-full flex flex-col">
            <div className="flex flex-col space-y-8 max-w-lg">
               <div className="w-24 h-24 border-neutral-300 border-2 flex items-center justify-center text-neutral-300 rounded-full">
                  <BsCardImage size={50}/>
               </div>
               <Field
                  inputValue=""
                  label="Name"
               />
               <Field
                  inputValue=""
                  label="Description"
                  textarea
               />
            </div>
            <button className="btn mt-10 ml-auto">Create campaign</button>
         </form>
      </div>
   )
}

export default Create