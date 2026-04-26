import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimilarProudctCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/product-details/${product.category?.categoryId}/${product.id}`)} className="cursor-pointer">
        <div className="group px-4 relative">
        <div className="card">
          
            <img
            className='card-media object-top' 
            src={product.images && product.images.length > 0 ? product.images[0] : ""} alt={product.title}/>
          
        </div>
        <div className="details pt-3 space-y-1 group-hover-effect rounded-md">
          <div className="name">
            <h1>{product.seller?.businessDetails?.businessName || 'Seller'}</h1>
            <p>{product.title}</p>
          </div>
          <div className="price flex items-center gap-3">
            <span className="font-sans text-gray-800">
              ₹ {product.sellingPrice}
            </span>
            <span className="thin-line-through text-gray-400  ">
              ₹ {product.mrpPrice}
            </span>
            <span className="text-[#00927c] font-semibold">
              {product.discountPercentage}% off
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SimilarProudctCard;
