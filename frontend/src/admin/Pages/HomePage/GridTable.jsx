import React from 'react'
import HomeCategoryTableTable from './HomeCategoryTable'
import { useAppSelector } from '../../../State/Store'

const GridTable = () => {
  const {customer}=useAppSelector(store=>store)
  return (
    <div>
      {console.log('customer home admin ',customer)}
      <HomeCategoryTableTable data={customer.homePageData?.grid || []}/>
    </div>
  )
}

export default GridTable
