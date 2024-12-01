import { ProductType } from "./products";

export type Friend = {
    id: string;
    firstName: string;
    lastName: string;
}


export type FriendWithProducts = {
    friendId: string;
    friendFirstName: string;
    products: ProductType[];
  }

