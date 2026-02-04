import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Button, Grid, TextField, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { createCoupon } from '../../../State/admin/AdminCouponSlice';

const AddNewCouponForm = () => {
    const dispatch = useAppDispatch();
    const { coupon } = useAppSelector(store => store);
    const jwt = localStorage.getItem('jwt');

    const formik = useFormik({
        initialValues: {
            code: "",
            discountPercentage: 0,
            validityStartDate: null,
            validityEndDate: null,
            minimumOrderValue: 0,
        },
        onSubmit: (values, { resetForm }) => {
            const formatedValues = {
                ...values,
                validityStartDate: values.validityStartDate?.toISOString(),
                validityEndDate: values.validityEndDate?.toISOString(),
            };

            // Dispatch the createCoupon action
            dispatch(createCoupon({ coupon: formatedValues, jwt }));
            resetForm();
        }
    });

    if (coupon.loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-2xl font-bold text-[#00927c] pb-5 text-center">Create New Coupon</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box component={'form'} onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item size={{xs:12,sm:6}}>
                            <TextField fullWidth name='code' label='Coupon Code' value={formik.values.code}
                                onChange={formik.handleChange} error={formik.touched.code && Boolean(formik.errors.code)}
                                helperText={formik.touched.code && formik.errors.code} />
                        </Grid>
                        <Grid item size={{xs:12,sm:6}}>
                            <TextField fullWidth name='discountPercentage' label='Discount Percentage' value={formik.values.discountPercentage}
                                onChange={formik.handleChange} error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)}
                                helperText={formik.touched.discountPercentage && formik.errors.discountPercentage} />
                        </Grid>

                        <Grid item size={{xs:12,sm:6}}>
                            <DatePicker sx={{ width: "100%" }} label='Validity Start Date' name='validityStartDate'
                                onChange={(value) => formik.setFieldValue("validityStartDate", value)} value={formik.values.validityStartDate} />
                        </Grid>
                        <Grid item size={{xs:12,sm:6}}>
                            <DatePicker sx={{ width: "100%" }} label='Validity End Date' name='validityEndDate'
                                onChange={(value) => formik.setFieldValue("validityEndDate", value)} value={formik.values.validityEndDate} />
                        </Grid>

                        <Grid item size={{xs:12,sm:12}}>
                            <TextField fullWidth name='minimumOrderValue' label='Minimum Order Value' value={formik.values.minimumOrderValue}
                                onChange={formik.handleChange} error={formik.touched.minimumOrderValue && Boolean(formik.errors.minimumOrderValue)}
                                helperText={formik.touched.minimumOrderValue && formik.errors.minimumOrderValue} />
                        </Grid>
                        <Grid item size={{xs:12,sm:12}}>
                            <Button type='submit' variant='contained' fullWidth sx={{ py: '.8rem' }} disabled={coupon.loading}>
                                {coupon.loading ? <CircularProgress size={24} /> : 'Create Coupon'}
                            </Button>
                        </Grid>
                    </Grid>
                    {coupon.error && <Typography color="error" className="mt-4 text-center">{coupon.error}</Typography>}
                    {coupon.couponCreated && <Typography color="success" className="mt-4 text-center">Coupon created successfully!</Typography>}
                </Box>
            </LocalizationProvider>
        </div>
    );
}

export default AddNewCouponForm;
