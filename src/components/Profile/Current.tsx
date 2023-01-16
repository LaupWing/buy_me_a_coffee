import React from "react"
import { BsFillCameraFill } from "react-icons/bs"
import { ExportInterface, ImageListType } from "react-images-uploading/dist/typings"

export interface Props {
   dragProps: ExportInterface["dragProps"],
   onImageUpload: () => void,
   image: ImageListType
}

const Current:React.FC<Props> = ({ dragProps, onImageUpload, image }) => {
   return (
      <button 
         onClick={onImageUpload}
         className={"w-24 h-24 border-neutral-300 border-2 flex items-center justify-center text-neutral-300 overflow-hidden rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"}
         {...dragProps}
      >
         <img 
            src={image[0].dataURL} 
            className="object-cover"
            alt="Profile image" 
         />
         <div className="inset-0 absolute text-white flex items-center justify-center bg-black/20">
            <BsFillCameraFill size={30}/>
         </div>
      </button>
   )
}

export default Current
