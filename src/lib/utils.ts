import { ITEMS } from "../../constants";

export const findItem = (item:string) => ITEMS.find(x => x.name === item)?.emoji || 0