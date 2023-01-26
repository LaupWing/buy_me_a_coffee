import React from "react"
import { FiUpload } from "react-icons/fi"
import { ExportInterface } from "react-images-uploading/dist/typings"

export interface Props {
   dragProps: ExportInterface["dragProps"],
   onImageUpload: () => void
} 

const Upload:React.FC<Props> = ({
   dragProps,
   onImageUpload
}) => {
   return (
      <button 
         className="flex space-x-2 items-center z-50 m-auto bg-white/70 p-4 rounded backdrop-blur-lg"
         onClick={onImageUpload}
         {...dragProps}
         type="button"
      >
         <FiUpload
            className="text-yellow-400" 
            size={30}
         />
         <p className="text-xs uppercase text-yellow-400 font-bold tracking-wider">Click here to upload a thumbnail</p>
      </button>
   )
}

export default Upload
