import React from 'react'
import ElectricCategory from './ElectricCategory/ElectricCategory'
import CategoryGrid from './CategoryGrid/CategoryGrid'
import Deal from './Deal/Deal'
import ShopByCategory from './ShopByCategory/ShopByCategory'
import { Button } from '@mui/material'
import { Storefront } from '@mui/icons-material'
// import Img from "../../../images/image.png"

const Home = () => {
  return (
    <>
    <div className='space-y-5 lg:space-y-10 relative pb-20'>
        <ElectricCategory/>
        <CategoryGrid/>
        
        <div className='pt-20'>
          <h1 className="text-lg lg:text-4xl font-bold text-[#00927c] pb-5 lg:pb-10 text-center">
            TODAY'S DEALS
          </h1>
          <Deal/>
        </div>

        <section className='py-20'>
          <h1 className="text-lg lg:text-4xl font-bold text-[#00927c] pb-5 lg:pb-10 text-center">
            SHOP BY CATEGORY
          </h1>
          <ShopByCategory/>
        </section>

        <section className=' lg:px-20 relative h-[200px] lg:h-[450px] object-cover'>
          <img className='h-full w-full' src="https://imgs.search.brave.com/BehCKW6Xfu9J-q1MCo7BFEHE5oLj9CHvGL_DW35P_5s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tMzY1/Y29udGVudGh1Yi53/cGVuZ2luZS5jb20v/ZW4tdXMvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjMvMDIvV2hl/bi10by11c2UtZ3Jl/eS12cy1ncmF5LTE2/MDB4NjAwLTEuanBn" alt="" />
          <div className="absolute top-1/10 left-4 lg:left-[15rem] transform-translate-1/2 font-semibold lg:text-4xl space-y-3">
          <h1>Sell your Product</h1>
          <p className='text-lg md:text-2xl'>with <span className='logo'>Buy Baazar</span></p>
            <div className="pt-6 flex justify-center">
              <Button variant='contained' startIcon={<Storefront/>} size='large'>
                Become Seller
              </Button>
            </div>
          </div>
        </section>
    </div>
    
    </>
  )
}

export default Home
