import React from "react"
import { BsFillCameraFill } from "react-icons/bs"
import { ExportInterface, ImageListType } from "react-images-uploading/dist/typings"

export interface Props {
   dragProps: ExportInterface["dragProps"],
   onImageUpload: () => void,
   image: ImageListType
}

const Current:React.FC<Props> = ({ dragProps, onImageUpload }) => {
   return (
      <button
         className="z-40 m-auto"
         onClick={onImageUpload}
         {...dragProps}
         type="button"
      >
         <BsFillCameraFill
            className="text-white" 
            size={30}
         />
      </button>
   )
}

export default Current