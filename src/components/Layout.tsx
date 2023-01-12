import React from "react"

interface Props {
   children?: React.ReactNode
}

const Layout:React.FC<Props> = ({children}) => {
   return (
      <div className="w-screen h-screen bg-slate-500">
         
         {children}
      </div>
   )
}

export default Layout
