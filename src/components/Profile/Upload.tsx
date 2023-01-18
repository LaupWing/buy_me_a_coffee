import React from "react"
import { FiUpload } from "react-icons/fi"
import { ExportInterface } from "react-images-uploading/dist/typings"

export interface Props {
   dragProps: ExportInterface["dragProps"],
   onImageUpload: () => void
}

const Upload:React.FC<Props> = ({dragProps, onImageUpload}) => {
   return (
      <button 
         onClick={onImageUpload}
         className={"w-24 h-24 border-neutral-300 border-2 flex items-center justify-center rounded-full overflow-hidden absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-cover"}
         style={{
            backgroundImage: "url(/assets/images/coffee_thumbnail.jpg)"
         }}
         type="button"
         {...dragProps}
      >
         <FiUpload className="text-yellow-400 z-50" size={30}/>
         <div className="bg-white/40 absolute inset-0"></div>
      </button>
   )
}

export default Upload
