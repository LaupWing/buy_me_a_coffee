import React from "react"
import ReactImageUploading, { ImageListType } from "react-images-uploading"
import Current from "./Current"

export interface Props {
   image: ImageListType,
   onImageChange: any
}

const Profile:React.FC<Props> = ({image, onImageChange}) => {
   return (
      <ReactImageUploading
         multiple={false}
         value={image}
         onChange={onImageChange}
      >
         {({
            dragProps,
            onImageUpload
         })=>(
            <>
               {image.length > 0 ? (
                  <Current
                     dragProps={dragProps}
                     onImageUpload={onImageUpload}
                     image={image}
                  />
               ) : (
                  <button 
                     onClick={onImageUpload}
                     className={"w-24 h-24 border-neutral-300 border-2 flex items-center justify-center text-neutral-300 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3"}
                     {...dragProps}
                  >
                     <BsCardImage size={50}/>
                     <BsUpload size={25} className="text-yellow-400 absolute bottom-0 right-0"/>
                  </button>
               )}
            </>
         )}
      </ImageUploading>
   )
}

export default Profile
