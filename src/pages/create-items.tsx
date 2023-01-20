import React, { FormEvent, useState } from "react"
import AddItemsForm from "../components/AddItemsForm"

const CreateItems = () => {

   return (
      <main className="container mx-auto mt-6 flex flex-col">
         <div className="bg-white p-4 w-full rounded shadow flex flex-col">
            <h2 className="uppercase font-bold tracking-wider text-neutral-500">Items</h2>
            <AddItemsForm/>
            <ul>
               
            </ul>
         </div>
      </main>
   )
}

export default CreateItems
