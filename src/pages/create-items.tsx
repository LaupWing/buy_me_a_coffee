import React, { FormEvent, useState } from "react"

const items = [
   {
      name: "coffee",
      emoji: 9749
   },
   {
      name: "cookie",
      emoji: 127850
   },
   {
      name: "pie",
      emoji: 127856
   },
   {
      name: "donut",
      emoji: 127849
   },
   {
      name: "icecream",
      emoji: 127846
   },
   {
      name: "pancake",
      emoji: 129374
   },
   {
      name: "bacon",
      emoji: 129363
   },
]

const CreateItems = () => {
   const [addingItems, setAddingItems] = useState<string[]>([])
   const [addedItems, setAddedItems] = useState<{price: number, items: string[]}[]>([])

   const handleSubmit = (e:FormEvent) => {
      e.preventDefault()
      
   }

   return (
      <main className="container mx-auto mt-6 flex flex-col">
         <div className="bg-white p-4 w-full rounded shadow flex flex-col">
            <h2 className="uppercase font-bold tracking-wider text-neutral-500">Items</h2>
            <form 
               className="flex border rounded px-4 py-2 my-4"
               onClick={handleSubmit}
            >
               <input 
                  type="number" 
                  placeholder="Price" 
                  className="outline-none text-2xl mr-auto" 
               />
               <div className="flex space-x-2">
                  {items.map(item =>(
                     <button
                        data-name={item.name} 
                        className={`text-4xl duration-150 ${
                           addingItems.includes(item.name) ? "" : "opacity-10 hover:opacity-100"
                        }`}
                        onClick={() => setAddingItems(prev => ([...prev, item.name]))}
                     >
                        {String.fromCodePoint(item.emoji)}
                     </button>
                  ))}
               </div>
               <button 
                  className="btn ml-4"
                  type="submit"
               >
                  Add
               </button>
            </form>
            <ul>
               
            </ul>
         </div>
      </main>
   )
}

export default CreateItems
