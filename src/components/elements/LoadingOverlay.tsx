import { HashLoader } from "react-spinners"
import { FC } from "react"

export const LoadingOverlay:FC<{
   message: string
}> = ({message}) => {
   return (
      <div className="fixed bg-white/90 z-50 inset-0 flex flex-col items-center justify-center">
         <HashLoader color="#FDE047" size={70}/>
         <p className="uppercase font-bold mt-10 text-yellow-300 animate-bounce">{message}</p>
      </div>
   )
}
