import React from "react"; 
import ElectricCategoryCard from "./ElectricCategoryCard";
import { useAppSelector } from "../../../../State/Store";
const ElectricCategory=()=>{
    const {customer}=useAppSelector(store=>store);
    console.log( "Customer - - ",customer);


    // If no data, show loading or empty state
  if (!customer.homePageData?.electricCategories) {
    return <div className="text-center py-5">No Electronic categories available</div>;
  }

    return(
        <div className="flex flex-wrap justify-between py-5 lg:px-20 border-b">
            {customer.homePageData?.electricCategories.slice(0,7).map((item)=><ElectricCategoryCard item={item}/>)}
            
        </div>
    );
}
export default ElectricCategory;