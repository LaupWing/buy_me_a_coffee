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
      <div 
         className="w-full flex bg-center bg-cover"
         style={{
            backgroundImage: `url(${image[0].dataURL})`
         }}
      >
         <button
            className="z-50 m-auto"
            onClick={onImageUpload}
            {...dragProps}
            type="button"
         >
            <BsFillCameraFill
               className="text-white" 
               size={30}
            />
         </button>
         <div className="bg-black/40 absolute inset-0"></div>
      </div>
   )
}

export default Current