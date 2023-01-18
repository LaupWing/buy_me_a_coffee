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
      <div 
         className="w-full flex bg-center bg-cover"
         style={{
            backgroundImage: "url(/assets/images/coffee_thumbnail.jpg)"
         }}
      >
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
         <div className="bg-white/40 absolute inset-0"></div>
      </div>
   )
}

export default Upload
