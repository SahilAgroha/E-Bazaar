import { Box, Button, Grid, TextField } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const BecomeSellerFormStep2 = ({formik}) => {
    
  return (
    <Box >
      <>
        <Grid container spacing={3}>
            <Grid size={{xs:12}}>
                <TextField fullWidth name='name' label='Name' value={formik.values.name} onChange={formik.handleChange}
                error={formik.touched && Boolean(formik.errors.name)} helperText={ formik.errors.name}/>
            </Grid>
            <Grid size={{xs:6}}>
                <TextField fullWidth name='mobile' label='Mobile' value={formik.values.mobile} onChange={formik.handleChange}
                error={formik.touched && Boolean(formik.errors.mobile)} helperText={formik.touched.mobile && formik.errors.mobile}/>
            </Grid>
            <Grid size={{xs:6}}>
                <TextField fullWidth name='pinCode' label='Pin Code' value={formik.values.pinCode} onChange={formik.handleChange}
                error={formik.touched && Boolean(formik.errors.pinCode)} helperText={formik.touched.pinCode && formik.errors.pinCode}/>
            </Grid>
            <Grid size={{xs:12}}>
                <TextField fullWidth name='address' label='Address' value={formik.values.address} onChange={formik.handleChange}
                error={formik.touched && Boolean(formik.errors.address)} helperText={formik.touched.name && formik.errors.address}/>
            </Grid>
            <Grid size={{xs:12}}>
                <TextField fullWidth name='locality' label='Locality' value={formik.values.locality} onChange={formik.handleChange}
                error={formik.touched && Boolean(formik.errors.locality)} helperText={formik.touched.locality && formik.errors.locality}/>
            </Grid>
            <Grid size={{xs:6}}>
                <TextField fullWidth name='city' label='City' value={formik.values.city} onChange={formik.handleChange}
                error={formik.touched && Boolean(formik.errors.city)} helperText={formik.touched.city && formik.errors.city}/>
            </Grid>
            <Grid size={{xs:6}}>
                <TextField fullWidth name='state' label='State' value={formik.values.state} onChange={formik.handleChange}
                error={formik.touched && Boolean(formik.errors.state)} helperText={formik.touched.name && formik.errors.state}/>
            </Grid>
           
        </Grid>
      </>
    </Box>
  )
}

export default BecomeSellerFormStep2
