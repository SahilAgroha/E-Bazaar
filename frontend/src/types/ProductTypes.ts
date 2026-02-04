import { Seller } from "./SellerTypes";

export interface Product{
    id?:Number;
    title:string;
    description:string;
    mrpPrice:number;
    sellingPrice:number;
    discountPercentage:number;
    quantity:number;
    color:string;
    images:string[];
    numRating?:number;
    category:Category;
    seller?:Seller;
    createdAt:Date;
    sizes:string;
}

export interface Category{
    id?:number;
    name:string;
    categoryId:string;
    parentCategory?:Category;
    level:number;
}