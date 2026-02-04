import React from 'react'
import ShopByCategoryCard from './ShopByCategoryCard'
import { useAppSelector } from '../../../../State/Store'

const ShopByCategory = () => {
  const {customer}=useAppSelector(store=>store)
  return (
    <div className='flex flex-wrap justify-between gap-7 lg:px-20'>
      {customer.homePageData?.shopByCategories.map((item) => <ShopByCategoryCard item={item}/>)}
    </div>
  )
}

export default ShopByCategory
