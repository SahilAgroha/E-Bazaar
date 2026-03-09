import React from 'react'
import HomeCategoryTableTable from './HomeCategoryTable'
import { useFormik } from 'formik'
import { useAppSelector } from '../../../State/Store'

const DealCategoryTable = () => {
  const {customer}=useAppSelector(store=>store);

    
  return (
    <div>
      <HomeCategoryTableTable data={customer.homePageData?.dealCategories || []}/>
    </div>
  )
}

export default DealCategoryTable
