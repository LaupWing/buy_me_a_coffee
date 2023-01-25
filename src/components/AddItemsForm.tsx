import React from "react"
import { useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { FaEthereum } from "react-icons/fa"
import { ITEMS } from "../../constants"
import { useAppSelector } from "../store/hooks"

interface FormValues {
   value: number
   items: string[]
}

interface Props {
   addListOfItems: (props:{
      items: string[],
      value: number
   }) => void 
}

const AddItemsForm:React.FC<Props> = ({addListOfItems}) => {
   const {
      register,
      control,
      reset,
      formState: { errors },
      handleSubmit,
   } = useForm<FormValues>({
      defaultValues: {
         items: []
      },
   })
   const [value, setValue] = useState("")
   const { ethPrice } = useAppSelector(state => state.contracts)

   const submitHandler: SubmitHandler<FormValues> = async ({items, value}) => {
      addListOfItems({items, value})
      setValue("")
      reset()
   }

   return (
      <form
         onSubmit={handleSubmit(submitHandler)}
         className="flex border rounded relative px-4 py-2 my-4"
      >
         <div className="absolute top-0 z-50 transform -translate-y-1/2 text-neutral-300 bg-white px-2">1 eth = {ethPrice} USD</div>
         <div className="flex flex-col flex-1">
            <div className="flex items-center flex-1">
               <FaEthereum className="text-gray-300 mr-2" size={30}/>
               <div className="text-2xl relative flex items-center">
                  <input
                     type="number"
                     placeholder="Price"
                     className="outline-none my-auto mr-auto"
                     {...register("value", {
                        required: "You need to set a value!",
                     })}
                     onChange={e => setValue(e.target.value)}
                  />
                  {value && <p className="absolute right-4 text-gray-200">
                     {Number(value) * ethPrice} USD
                  </p>}
               </div>
            </div>
            {errors.value && (
               <p className="error mt-2">{errors.value.message}</p>
            )}
         </div>
         <div className="flex flex-col">
            <div className="flex space-x-2">
               <Controller
                  control={control}
                  name="items"
                  rules={{
                     required: "You need at least one item!",
                  }}
                  render={({ field }) => (
                     <>
                        {ITEMS.map((item) => {
                           const checked = field.value.find(
                              (x) => x === item.name
                           )
                           return (
                              <label
                                 key={item.name}
                                 className={`text-4xl cursor-pointer duration-150 ${
                                    checked
                                       ? ""
                                       : "opacity-10 hover:opacity-100"
                                 }`}
                                 htmlFor={item.name}
                              >
                                 <input
                                    type="checkbox"
                                    id={item.name}
                                    className="sr-only"
                                    onChange={(e) => {
                                       if (e.target.checked) {
                                          field.onChange([
                                             ...field.value,
                                             item.name,
                                          ])
                                       } else {
                                          field.onChange(
                                             [...field.value].filter(
                                                (val) => val !== item.name
                                             )
                                          )
                                       }
                                    }}
                                 />
                                 {String.fromCodePoint(item.emoji)}
                              </label>
                           )
                        })}
                     </>
                  )}
               />
               <button className="btn ml-4" type="submit">
                  Add
               </button>
            </div>
            {errors.items && (
               <p className="error mt-2">{errors.items.message}</p>
            )}
         </div>
      </form>
   )
}
export default AddItemsForm
