import React, { useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"

interface FormValues {
   value: number
   items: string[]
}

interface Item {
   name: string
   emoji: number
}

const AddItemsForm = () => {
   const [items, setItems] = useState<Item[]>([
      {
         name: "coffee",
         emoji: 9749,
      },
      {
         name: "cookie",
         emoji: 127850,
      },
      {
         name: "pie",
         emoji: 127856,
      },
      {
         name: "donut",
         emoji: 127849,
      },
      {
         name: "icecream",
         emoji: 127846,
      },
      {
         name: "pancake",
         emoji: 129374,
      },
      {
         name: "bacon",
         emoji: 129363,
      },
   ])

   const {
      register,
      control,
      formState: { errors },
      handleSubmit,
   } = useForm<FormValues>({
      defaultValues: {
         items: [],
      },
   })

   const submitHandler: SubmitHandler<FormValues> = async (data) => {
      console.log(data)
   }

   console.log(errors)
   return (
      <form
         onSubmit={handleSubmit(submitHandler)}
         className="flex border rounded px-4 py-2 my-4"
      >
         <div className="flex flex-col flex-1">
            <input
               type="number"
               placeholder="Price"
               className="outline-none text-2xl my-auto"
               {...register("value", {
                  required: "You need to set a value!",
               })}
            />
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
                        {items.map((item) => {
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
