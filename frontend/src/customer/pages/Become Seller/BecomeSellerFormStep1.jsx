import { Box, TextField } from '@mui/material'
import React from 'react'

const BecomeSellerFormStep1 = ({formik}) => {
  return (
    <Box className=''>
      <p className="text-xl font-bold text-center pb-9">Contact Details</p>
      <div className="space-y-9">
        <TextField fullWidth name='mobile' label="Mobile" onChange={formik.handleChange} value={formik.values.mobile}
        error={formik.touched.mobile && Boolean(formik.error.mobile)}
        helperText={formik.touched.mobile && formik.error.mobile}/>

        <TextField fullWidth name='GSTIN' label="GSTIN" onChange={formik.handleChange} value={formik.values.GSTIN}
        error={formik.touched.GSTIN && Boolean(formik.error.GSTIN)}
        helperText={formik.touched.GSTIN && formik.error.GSTIN}/>

        {/* <TextField fullWidth name='mobile' label="Mobile" onChange={formik.value.mobile}
        error={formik.touched.mobile && Boolean(formik.error.mobile)}
        helperText={formik.touched.mobile && formik.error.mobile}/> */}

      </div>
    </Box>
  )
}

export default BecomeSellerFormStep1
