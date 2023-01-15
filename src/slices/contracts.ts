import { createSlice } from "@reduxjs/toolkit"
import { BuyMeACoffeeFactory, BuyMeACoffee } from "../../backend/typechain-types"

export interface ContractsState {
   contract: null
}

export const contractsSlice = createSlice({
   name: "contracts",
   initialState: {},
   reducers: {}
})

export default contractsSlice.reducer