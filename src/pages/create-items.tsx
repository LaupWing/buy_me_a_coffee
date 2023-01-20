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

                     {items.map(item =>(
                        <span 
                           data-name={item.name} 
                           className="text-4xl"
                        >
                           {String.fromCodePoint(item.emoji)}
                        </span>
                     ))}
                  </div>
               </li>
            </ul>
         </div>
      </main>
   )
}

export default CreateItems
