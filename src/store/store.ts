import { configureStore } from "@reduxjs/toolkit"
import web3Reducer from "../slices/web3"

export const store = configureStore({
   reducer: {
      web3: web3Reducer      
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck:false
      }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
