import "../../styles/globals.css"
import {SiBuymeacoffee} from "react-icons/si"

interface Props {
   children: React.ReactNode
}

export default function RootLayout({
   children,
}: Props) {
   return (
      <html>
         <head />
         <body className="w-screen h-screen bg-neutral-100 flex flex-col">
            <header className="bg-white p-4 flex mx-auto w-full max-w-5xl rounded-lg shadow mt-4">
               <div className="text-neutral-700">
                  <SiBuymeacoffee size={30}/>
               </div>
               <div className="flex items-center ml-auto space-x-6">
                  <p className="font-bold text-xs text-neutral-600 tracking-wider capitalize">My Campaigns</p>
                  <button className="btn">Create</button>
               </div>
            </header>
            {children}
         </body>
      </html>
   )
}
