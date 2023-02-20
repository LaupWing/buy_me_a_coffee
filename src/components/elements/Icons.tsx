import { IconType } from "react-icons"
import { BiSearchAlt } from "react-icons/bi"
import { BsFillCameraFill, BsTrashFill } from "react-icons/bs"
import { FaEthereum } from "react-icons/fa"
import { FiUpload } from "react-icons/fi"
import { SiBuymeacoffee } from "react-icons/si"
import { AiOutlineUndo } from "react-icons/ai"

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

export const IconCoffee:IconType = (props) => {
   return (
      <SiBuymeacoffee {...props}/>
   )
}

export const IconSearch:IconType = (props) => {
   return (
      <BiSearchAlt {...props}/>
   )
}

export const IconTrashcan:IconType = (props) => {
   return (
      <BsTrashFill {...props}/>
   )
}

export const IconUndo:IconType = (props) => {
   return (
      <AiOutlineUndo {...props}/>
   )
}