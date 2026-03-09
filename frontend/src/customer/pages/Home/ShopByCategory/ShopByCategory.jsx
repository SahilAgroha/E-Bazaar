import React from 'react'

import { useAppSelector } from '../../../../State/Store'
import ShopByCategoryCar from './ShopByCategoryCar'

const ShopByCategory = () => {
  const {customer}=useAppSelector(store=>store)
  return (
    <div className='flex flex-wrap justify-between gap-7 lg:px-20'>
  
      {customer.homePageData?.shopByCategories.map((item) => <ShopByCategoryCar item={item}/>)}
    </div>

  )
}

export default ShopByCategory
