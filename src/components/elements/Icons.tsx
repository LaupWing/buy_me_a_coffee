import { IconType } from "react-icons"
import { BsFillCameraFill } from "react-icons/bs"
import { FaEthereum } from "react-icons/fa"
import { FiUpload } from "react-icons/fi"

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

export const IconUpload:IconType = (props) => {
   return (
      <FiUpload {...props}/>
   )
}