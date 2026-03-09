import React from 'react'
import HomeCategoryTableTable from './HomeCategoryTable'
import { useAppSelector } from '../../../State/Store'

const ShopByCategoryTable = () => {
  const {customer}=useAppSelector(store=>store)
  console.log("Shop by category ",customer.homePageData)
  return (
    <div>
      <HomeCategoryTableTable data={customer.homePageData?.shopByCategories  || []}/>
    </div>
  )
}

export default ShopByCategoryTable
