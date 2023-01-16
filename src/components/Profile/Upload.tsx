import React from "react"
import { BsCardImage, BsUpload } from "react-icons/bs"
import { ExportInterface } from "react-images-uploading/dist/typings"

export interface Props {
   dragProps: ExportInterface["dragProps"],
   onImageUpload: () => void
}

const Upload:React.FC<Props> = ({dragProps, onImageUpload}) => {
   return (
      <button 
         onClick={onImageUpload}
         className={"w-24 h-24 border-neutral-300 border-2 flex items-center justify-center text-neutral-300 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3"}
         {...dragProps}
      >
         <BsCardImage size={50}/>
         <BsUpload size={25} className="text-yellow-400 absolute bottom-0 right-0"/>
      </button>
   )
}

export default Upload
