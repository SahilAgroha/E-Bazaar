import React from 'react'
import HomeCategoryTableTable from './HomeCategoryTable'
import { useAppSelector } from '../../../State/Store'

const ElectronicTable = () => {
  const {customer}=useAppSelector(store=>store)
  return (
    <div>
      <HomeCategoryTableTable data={customer.homePageData?.electricCategories || []}/>
    </div>
  )
}

export default ElectronicTable
