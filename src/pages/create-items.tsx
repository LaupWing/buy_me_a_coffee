

const CreateItems = () => {
   return (
      <main className="container mx-auto mt-6 flex flex-col">
         <div className="bg-white p-4 w-full rounded shadow flex flex-col">
            <h2 className="uppercase font-bold tracking-wider text-neutral-500">Items</h2>
            <ul className="p-4">
               <li className="flex justify-between border rounded p-2">
                  <input 
                     type="number" 
                     placeholder="Price" 
                     className="outline-none text-2xl" 
                  />
                  <div className="flex">
                     <span data-name="coffee" className="text-4xl">&#x2615;</span>
                     <span data-name="cookie" className="text-4xl">&#x1F36A;</span>
                     <span data-name="pie" className="text-4xl">&#x1F370;</span>
                     <span data-name="donut" className="text-4xl">&#x1F369;</span>
                     <span data-name="icecream" className="text-4xl">&#x1F366;</span>
                     <span data-name="chocolate" className="text-4xl">&#x1F36B;</span>
                     <span data-name="pancake" className="text-4xl">&#x1F95E;</span>
                  </div>
               </li>
            </ul>
         </div>
      </main>
   )
}

export default CreateItems
