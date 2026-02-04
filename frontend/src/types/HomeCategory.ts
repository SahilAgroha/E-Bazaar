import { Deal } from "./dealType";


export interface HomeData{
    id:number;
    grid:HomeCategory[];
    shopByCategories:HomeCategory[];
    electricCategories:HomeCategory[];
    deals:Deal[];
    dealCategories:HomeCategory[];
}

export interface HomeCategory{
    id?:number;
    categoryId:string;
    section?:string;
    name?:string;
    image:string;
    parentCategoryId:string;
}

export type HomeCategorySection =
  | "GRID"
  | "SHOP_BY_CATEGORIES"
  | "ELECTRIC_CATEGORIES"
  | "DEALS";