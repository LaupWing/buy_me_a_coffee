import { BigNumber } from "ethers"

export interface BuyMeACoffeeType {
   name: string
   description: string
   thumbnail: string
   profile?: string
   address?: string
   owner?: string
   listOfItems: ListOfItem[]
}

export interface ItemsType {
   items: string[],
   value: number
}

export interface ListOfItems {
   id: BigNumber
   names: string[]
   cost: BigNumber
}