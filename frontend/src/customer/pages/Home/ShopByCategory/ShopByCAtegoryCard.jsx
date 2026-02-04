import React from 'react'
import './ShopByCategory.css'
const ShopByCategoryCard = ({item}) => {
  return (
    <div className='flex gap-3 flex-col justify-center items-center group cursor-pointer'>
        <div className='custome-border w-[150px] h-[150px] lg:w-[249px] lg:h-[249px] rounded-full bg-[#00927c]'>
            <img className='rounded-full group-hover:scale-95 transition-transform transition-transform-duration-700 object-top h-full w-full'
             src={item.image} alt=''/>
        </div>
        <h1>{item.name}</h1>
      
    </div>
  )
}

export default ShopByCategoryCard
