import React from 'react'
import SimilarProudctCard from './SimilarProudctCard'
import "./SimilarProduct.css"

const SimilarProduct = () => {
  return (
    <div className="similar-grid">
      {[1, 1, 1, 1, 1, 1].map((item, index) => (
        <SimilarProudctCard key={index} />
      ))}
    </div>
  )
}

export default SimilarProduct
