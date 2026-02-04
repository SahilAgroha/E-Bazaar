import { Product } from "./ProductTypes";
import { User } from "./userTypes";


export interface Review {
    id: number;
    reviewText: string;
    rating: number;
    productImages?: string[]; // Optional since it's not always provided
    product: Product;
    user: User;
    createdAt: string;
}

export interface ReviewState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
    reviewCreated: boolean;
    reviewUpdated: boolean;
}