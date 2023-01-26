import { NextPage } from "next"
import { useRouter } from "next/router"
import Field from "../components/Field"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { ImageListType } from "react-images-uploading"
import { useState } from "react"
import Thumbnail from "../components/Thumbnail"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { PinataPinResponse } from "@pinata/sdk"
import AddItemsForm from "../components/AddItemsForm"
import Items from "../components/Items"
import { ItemsType } from "../../typings"
import { parseListOfItems } from "../../utils/parsers"
import Profile from "../components/Profile"

interface FormValues {
   description: string
   name: string
   listOfItems: ListOfItems
   profile: ImageListType
   thumbnail: ImageListType
}

export type ListOfItems = ItemsType[]

const Create:NextPage = () => {
   const router = useRouter()
   const { alreadyRegistered, buyMeACoffeeFactory } = useAppSelector(state => state.contracts)
   const { account } = useAppSelector(state => state.web3)
   const [profile, setProfile] = useState<ImageListType>([])
   const [thumbnail, setThumbnail] = useState<ImageListType>([])
   const [showError, setShowError] = useState(false)
   const [triedSubmit, setTriedSubmit] = useState(false)
   const dispatch = useAppDispatch()

   const { 
      register,
      control,
      getValues,
      setValue,
      setError,
      formState: {
         errors
      },
      handleSubmit
   } = useForm<FormValues>({
      defaultValues: {
         name: "",
         description: "",
         thumbnail: undefined,
         profile: undefined,
         listOfItems: []
      },
   })

   if(alreadyRegistered){
      router.push("/")
   }

   const onProfileChange = (
      imageList: ImageListType
   ) => {
      setProfile(imageList)
   }

   const onThumbnailChange = (
      imageList: ImageListType
   ) => {
      setThumbnail(imageList)
   }

   const submitHandler:SubmitHandler<FormValues> = async ({
      description, 
      name, 
      listOfItems,
      thumbnail
   }) => {
      setTriedSubmit(true)
      if(!showError && (profile.length === 0 || thumbnail.length === 0)){
         setShowError(true)
         return
      }
      if(triedSubmit){
         if(profile.length === 0 || thumbnail.length === 0){
            const confirmed = confirm("Either profile or thumbnail is not set are you sure you want to continue?")
            if(confirmed){
               uploadToIpfs(name, description, listOfItems)
            }
         }
      }else{
         uploadToIpfs(name, description, listOfItems)
      }
   }

   const addListOfItems = (listOfItems:{
      items: string[],
      value: number
   }) => {
      const {listOfItems:prev} = getValues()
      setValue("listOfItems", [...prev, listOfItems])
      setError("listOfItems", {
         type: "focus"
      })
   }

   const uploadToIpfs = async (
      name: string, 
      description:string,
      listOfItems: ListOfItems
   ) => {
      const test = parseListOfItems(listOfItems)
      console.log(test)
      // const response = await axios.post<{
      //    profileUri: PinataPinResponse
      //    thumbnailUri: PinataPinResponse
      // }>("/api/pinata", {
      //    profile: profile[0].file,
      //    thumbnail: thumbnail[0].file,
      //    account
      // }, {
      //    headers: {
      //       "Content-Type": "multipart/form-data",
      //    },
      // })

      // const transaction = await buyMeACoffeeFactory?.createBuyMeACoffee(
      //    name, 
      //    description, 
      //    response.data.profileUri.IpfsHash,
      //    response.data.thumbnailUri.IpfsHash
      // )
      // console.log(transaction)
      // const transactionReceipt = await transaction?.wait()
      // const event = transactionReceipt?.events!.find(e => e.event === "BuyMeACoffeeCreated")
      // console.log(event?.args!.buyMeACoffeeAddress)
   }

   return (
      <div className="mt-10 container bg-white rounded-md overflow-hidden shadow">
         <div className="w-full flex h-52 bg-cover relative border-b-2 border-neutral-300">
            <Thumbnail control={control}/>
            <Profile
               image={profile}
               onImageChange={onProfileChange}
            />
         </div>
         <div className="px-6 my-10 mt-16">
            <AddItemsForm addListOfItems={addListOfItems}/>
            {errors.listOfItems && <p className="error">{errors.listOfItems.message?.toString()}</p>}
         </div>
         <form onSubmit={handleSubmit(submitHandler)} className="w-full flex flex-col">
            <div className="flex px-6 flex-col space-y-8 max-w-lg">
               <ul>
                  <Controller
                     control={control}
                     name="listOfItems"
                     rules={{
                        required: "You need at least one list of items!"
                     }}
                     render={({field}) => (
                        <>
                           {field.value.map(items => (
                              <Items
                                 {...items}
                              />
                           ))}
                        </>
                     )}
                  />
               </ul>
               <Field
                  label="Name"
                  type="name"
                  register={register("name", {
                     required: "Please enter name"
                  })}
                  errors={errors}
                  />
               <Field
                  type="description"
                  label="Description"
                  textarea
                  register={register("description", {
                     required: "Please enter description"
                  })}
                  errors={errors}
               />
            </div>
            {(showError && profile.length === 0) && 
               <p className="text-red-400 text-right my-1 pr-6 tracking-wider text-xs uppercase font-bold">
                  Please set your profile otherwise the default would be used
               </p>
            }
            {(showError && thumbnail.length === 0) && 
               <p className="text-red-400 text-right my-1 pr-6 tracking-wider text-xs uppercase font-bold">
                  Please set your thumbnail otherwise the default would be used
               </p>
            }
            <button 
               className="btn m-6 mt-2 ml-auto"
               type="submit"
            >
               Create campaign
            </button>
         </form>
      </div>
   )
}

export default Create