import React, { FormEvent, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"


interface FormValues {
   value: number
   items: string[]
}

interface Item {
   name: string
   emoji: number
   checked: boolean
}
 
const AddItemsForm = () => {
   const [items, setItems] = useState<Item[]>([
      {
         name: "coffee",
         emoji: 9749,
         checked: false
      },
      {
         name: "cookie",
         emoji: 127850,
         checked: false
      },
      {
         name: "pie",
         emoji: 127856,
         checked: false
      },
      {
         name: "donut",
         emoji: 127849,
         checked: false
      },
      {
         name: "icecream",
         emoji: 127846,
         checked: false
      },
      {
         name: "pancake",
         emoji: 129374,
         checked: false
      },
      {
         name: "bacon",
         emoji: 129363,
         checked: false
      },
   ])
   
   const { 
      register,
      control,
      formState: {
         errors
      },
      handleSubmit
   } = useForm<FormValues>({
      defaultValues: {
         items: []
      }
   })
   
   const submitHandler:SubmitHandler<FormValues> = async (data) => {
      console.log(data)
   }

   console.log(errors)
   return (
      <form 
         onSubmit={handleSubmit(submitHandler)}
         className="flex border rounded px-4 py-2 my-4"
      >
         <input 
            type="number" 
            placeholder="Price" 
            className="outline-none text-2xl mr-auto"
            {...register("value", {
               required: "You need to set a value!"
            })}
         />
         <div className="flex space-x-2">
            <Controller
               control={control}
               name="items"
               rules={{
                  required: "You need at least one item!",
               }}
               render={({ field }) => (
                  <>
                     {items.map(item =>{
                        const checked = field.value.find(x => x === item.name)
                        return (
                           <label 
                              key={item.name}
                              className={`text-4xl cursor-pointer duration-150 ${
                                 checked ? "" : "opacity-10 hover:opacity-100"
                              }`}
                              htmlFor={item.name}
                           >
                              <input 
                                 type="checkbox"
                                 id={item.name}
                                 className="sr-only"
                                 onChange={(e) => {
                                    if(e.target.checked){
                                       field.onChange([
                                          ...field.value,
                                          item.name
                                       ])
                                    }else{
                                       field.onChange([
                                          ...field.value
                                       ].filter(val => val !== item.name))
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
         </div>
         <button 
            className="btn ml-4"
            type="submit"
         >
            Add
         </button>
      </form>
   )
}
export default AddItemsForm