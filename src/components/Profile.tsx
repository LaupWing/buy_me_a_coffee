import React from "react"

const Profile = () => {
   return (
      <ImageUploading
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
                  <button 
                     onClick={onImageUpload}
                     className={"w-24 h-24 border-neutral-300 border-2 flex items-center justify-center text-neutral-300 overflow-hidden rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3"}
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
