import { IconType } from "react-icons"
import { BsFillCameraFill } from "react-icons/bs"
import { FaEthereum } from "react-icons/fa"

export const IconEthereum:IconType = (props) =>{
   return (
      <FaEthereum {...props}/>
   )
}

export const IconCamera:IconType = (props) => {
   return (
      <BsFillCameraFill {...props}/>
   )
}