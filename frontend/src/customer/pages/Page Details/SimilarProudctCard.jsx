import React from 'react'

const SimilarProudctCard = () => {
  return (
    <div>
        <div className="group px-4 relative">
        <div className="card">
          
            <img
            className='card-media object-top' 
            src={"https://sareesbazaar.in/cdn/shop/files/SB61_2974_30011A_14b3c73a-b2b0-414f-8557-af7575d8e06b.jpg?v=1749814391&width=1680"} alt=''/>
          
        </div>
        <div className="details pt-3 space-y-1 group-hover-effect rounded-md">
          <div className="name">
            <h1>Niky</h1>
            <p>Black T-Shirt</p>
          </div>
          <div className="price flex items-center gap-3">
            <span className="font-sans text-gray-800">
              ₹ 400
            </span>
            <span className="thin-line-through text-gray-400  ">
              ₹ 999
            </span>
            <span className="text-[#00927c] font-semibold">
              60% off
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SimilarProudctCard
