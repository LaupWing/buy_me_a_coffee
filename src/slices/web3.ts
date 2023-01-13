import { MetaMaskInpageProvider } from "@metamask/providers"
import { createSlice } from "@reduxjs/toolkit"

declare global {
   interface Window {
      ethereum?: MetaMaskInpageProvider
   }
}

const initialState = {

}

export const web3Slice = createSlice({
   name: "web3",
   initialState,
   reducers: {}
})