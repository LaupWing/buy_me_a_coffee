import { MetaMaskInpageProvider } from "@metamask/providers"
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit"
import { ethers } from "ethers"
import { JsonRpcSigner } from "@ethersproject/providers/src.ts/json-rpc-provider"
import { Web3Provider } from "@ethersproject/providers/src.ts/web3-provider"

declare global {
   interface Window {
      ethereum?: MetaMaskInpageProvider
   }
}

const initialState = {
   account: null,
   chainId: null,
   provider: null
}

export const web3Slice = createSlice({
   name: "web3",
   initialState,
   reducers: {
      setWeb3(state, action:PayloadAction<{
         chainId: string,
         signer: JsonRpcSigner,
         provider: Web3Provider
      }>){

      }
   }
})

export const loadWeb3 =
   () => async (dispatch: Dispatch) => {
      if(!window.ethereum){
         return window.alert("Non-Ethereum browser detected. You should consider trying metamask!")
      }
      const provider = new ethers.providers.Web3Provider(<any>window.ethereum)
      const signer = provider.getSigner()
      const chainId = (await provider.getNetwork()).chainId?.toString()
      dispatch(setWeb3({
         chainId,
         signer,
         provider
      }))
   }


export const {
   setWeb3
} = web3Slice.actions

export default web3Slice.reducer