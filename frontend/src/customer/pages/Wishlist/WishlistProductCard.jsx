import { Close } from '@mui/icons-material'
import React from 'react'
import { useAppDispatch } from '../../../State/Store'
import { addProductToWishlist } from '../../../State/customer/wishlistSlice';
import { teal } from '@mui/material/colors';

const WishlistProductCard = ({item}) => {
  const dispatch=useAppDispatch();


  const handleWishlist=()=>{  
      item.id && dispatch(addProductToWishlist({productId:item.id}))
    }

  return (
    <div className='w-60 relative'>
      <div className="w-full">
        <img src={item.images[0]} className='object-top w-full'/>
      </div>
      <div className="pt-3 space-y-1">
        <p>{item.title}</p>
        <div className="price flex items-center gap-3">
            <span className="font-sans text-gray-800">
              ₹{item.sellingPrice}
            </span>
            <span className="thin-line-through text-gray-400  ">
              ₹{item.mrpPrice}
            </span>
            <span className="text-[#00927c] font-semibold">
              {item.discountPercent}%
            </span>
          </div>
      </div>
      <div className="absolute top-1 right-1">
        <button onClick={handleWishlist}>
          <Close sx={{color:teal[500], fontSize:'2rem'}} className='cursor-pointer rounded-md bg-white p-1'/>
        </button>
      </div>
    </div>
  )
}

export default WishlistProductCard
