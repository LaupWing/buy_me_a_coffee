const items = [
   {
      name: "coffee",
      emoji: "&#x2615;"
   },
   {
      name: "cookie",
      emoji: "&#x1F36A;"
   },
   {
      name: "pie",
      emoji: "&#x1F370;"
   },
   {
      name: "donut",
      emoji: "&#x1F369;"
   },
   {
      name: "icecream",
      emoji: "&#x1F366;"
   },
   {
      name: "pancake",
      emoji: "&#x1F95E;"
   },
   {
      name: "chocolate",
      emoji: "&#x1F36B;"
   },
]

const CreateItems = () => {
   return (
      <main className="container mx-auto mt-6 flex flex-col">
         <div className="bg-white p-4 w-full rounded shadow flex flex-col">
            <h2 className="uppercase font-bold tracking-wider text-neutral-500">Items</h2>
            <ul className="p-4">
               <li className="flex justify-between border rounded px-4 py-3">
                  <input 
                     type="number" 
                     placeholder="Price" 
                     className="outline-none text-2xl" 
                  />
                  <div className="flex">
                  <span data-name="pancake" className="text-4xl"></span>
                  </div>
               </li>
            </ul>
         </div>
      </main>
   )
}

export default CreateItems
