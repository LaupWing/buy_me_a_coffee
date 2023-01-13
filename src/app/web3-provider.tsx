"use-client"

import React from "react"
import { Provider } from "react-redux"
import { store } from "../store/store"

interface Props {
   children: React.ReactNode
}

const Web3Provider:React.FC<Props> = ({children}) => {
   return (
      <Provider store={store}>
         {children}
      </Provider>
   )
}

export default Web3Provider
