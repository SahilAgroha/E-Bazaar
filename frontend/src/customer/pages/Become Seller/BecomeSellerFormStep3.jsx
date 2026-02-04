import { TextField } from '@mui/material'
import React from 'react'

const BecomeSellerFormStep3 = ({formik}) => {
  return (
    <div className='space-y-5'>
        <TextField fullWidth name='bankDetails.accountNumber' value={formik.values.bankDetails.accounNumber}
        onChange={formik.handleChange} onBlur={formik.handleBlur} label="Account Number"
        error={formik.touched.bankDetails?.accounNumber && Boolean(formik.errors.bankDetails?.accounNumber)}
        helperText={formik.touched.bankDetails?.accounNumber && formik.errors.bankDetails?.accounNumber}/>
        
        <TextField fullWidth name='bankDetails.ifscCode' value={formik.values.bankDetails.ifscCode}
        onChange={formik.handleChange} onBlur={formik.handleBlur} label="IFSC Code"
        error={formik.touched.bankDetails?.ifscCode && Boolean(formik.errors.bankDetails?.ifscCode)}
        helperText={formik.touched.bankDetails?.ifscCode && formik.errors.bankDetails?.ifscCode}/>
        
        <TextField fullWidth name='bankDetails.accountHolderName' value={formik.values.bankDetails.accounHolderName}
        onChange={formik.handleChange} onBlur={formik.handleBlur} label="Account Holder Name"
        error={formik.touched.bankDetails?.accounHolderName && Boolean(formik.errors.bankDetails?.accounHolderName)}
        helperText={formik.touched.bankDetails?.accounHolderName && formik.errors.bankDetails?.accounHolderName}/>
      
    </div>
  )
}

export default BecomeSellerFormStep3
