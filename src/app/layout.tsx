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
            </header>
            {children}
         </body>
      </html>
   )
}
