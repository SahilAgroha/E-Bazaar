import React from "react";

const ElectricCategoryCard=({item})=>{
    return(
        <div className="flex flex-col gap-2 justify-center">
            <img  className="object-contain h-10" src={item.image} alt="laptop"/>
            <h2 className="font-semibold text-sm text-center">{item.name}</h2>
        </div>
    );
}

export default ElectricCategoryCard;