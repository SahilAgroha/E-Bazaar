import React from 'react'
import SimilarProudctCard from './SimilarProudctCard'
import "./SimilarProduct.css"
import { useAppSelector } from '../../../State/Store'
import { CircularProgress, Typography } from '@mui/material'

const SimilarProduct = () => {
  const { product } = useAppSelector(store => store);

  if (product.loading) {
    return <div className="similar-loading flex justify-center py-5"><CircularProgress /></div>
  }

  if (!product.similarProducts || product.similarProducts.length === 0) {
    return <Typography className="py-5 text-gray-500">No similar products found.</Typography>
  }

  return (
    <div className="similar-grid">
      {product.similarProducts.map((item, index) => (
        <SimilarProudctCard key={item.id || index} product={item} />
      ))}
    </div>
  )
}

export default SimilarProduct
