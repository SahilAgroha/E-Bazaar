import React, { useEffect, useState } from 'react'
import "./ProductCard.css"
import { Favorite, ModeComment } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../State/Store';
import { addProductToWishlist } from '../../../State/customer/wishlistSlice';


const ProductCard = ({item}) => {
  const [currentImage,setCurrentImage]=useState(0);
  const [isHovered,setIsHovered]=useState(false);
  const navigate=useNavigate();
  const dispatch=useAppDispatch();

  useEffect(()=>{
    let interval
    if(isHovered){
      interval=setInterval(()=>{
        setCurrentImage((prevImage)=>(prevImage+1) % item.images.length);
      },1000);
    }
    else if(interval){
      clearInterval(interval);
      interval=null;
    }
    return ()=>clearInterval(interval);
  },[isHovered]);

  const handleWishlist=(event)=>{
    event.stopPropagation();

    item.id && dispatch(addProductToWishlist({productId:item.id}))
  }

  return (
    <>
      <div onClick={()=>navigate(`/product-details/${item.category?.categoryId}/${item.id}`)} className="group px-4 relative">

        <div className="card"
        onMouseEnter={()=>setIsHovered(true)}
        onMouseLeave={()=>setIsHovered(false)}>
          {
            item.images.map((item,index)=><img
            className='card-media object-top' 
            src={item} alt=''
            style={{transform:`translateX(${(index-currentImage)*100}%)`}}/>)
          }
          { isHovered &&
            <div className='indicator flex flex-col items-center space-y-2'>
              <div className='flex gap-3'>
                <Button onClick={handleWishlist} varient='contained' sx={{backgroundColor: '#EAF0F1','&:hover': {backgroundColor: '#D0D7D9'},}}>
                  <Favorite sx={{color:"teal"}}/>
                </Button>
                <Button varient='contained' sx={{backgroundColor: '#EAF0F1','&:hover': {backgroundColor: '#D0D7D9'},}}>
                  <ModeComment sx={{color:"teal"}}/>
                </Button>

              </div>
            </div>
          }
        </div>
        <div className="details pt-3 space-y-1 group-hover-effect rounded-md">
          <div className="name">
            <h1>{item.seller?.businessDetails.businessName}</h1>
            <p>{item.title}</p>
          </div>
          <div className="price flex items-center gap-3">
            <span className="font-sans text-gray-800">
              ₹{item.sellingPrice}
            </span>
            <span className="thin-line-through text-gray-400  ">
              ₹{item.mrpPrice}
            </span>
            <span className="text-[#00927c] font-semibold">
              {item.discountPercentage}%
            </span>
          </div>

        </div>
      </div>
    </>
  )
}

export default ProductCard
