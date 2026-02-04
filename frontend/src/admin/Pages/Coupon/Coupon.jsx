import { Delete } from '@mui/icons-material';
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { deleteCoupon, getAllCoupons } from '../../../State/admin/AdminCouponSlice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover, },
    '&:last-child td, &:last-child th': { border: 0, },
}));

const Coupon = () => {
    const dispatch = useAppDispatch();
    const { coupon } = useAppSelector(store => store);
    const jwt = localStorage.getItem('jwt');

    useEffect(() => {
        if (jwt) {
            dispatch(getAllCoupons({ jwt }));
        }
    }, [dispatch, jwt]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            dispatch(deleteCoupon({ id, jwt }));
        }
    };

    if (coupon.loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (coupon.error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                <Typography variant="h6">Error loading coupons: {coupon.error}</Typography>
            </div>
        );
    }

    return (
        <div className="p-5">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label='customized-table'>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Coupon Code</StyledTableCell>
                            <StyledTableCell>Start Date</StyledTableCell>
                            <StyledTableCell>End Date</StyledTableCell>
                            <StyledTableCell align='right'>Minimum Order Value</StyledTableCell>
                            <StyledTableCell align='right'>Discount</StyledTableCell>
                            <StyledTableCell align='right'>Status</StyledTableCell>
                            <StyledTableCell align='right'>Delete</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                      {console.log('coupon - - ',coupon)}
                        {coupon.coupons.length > 0 ? (
                            coupon.coupons.map((item) => (
                                <StyledTableRow key={item.id}>
                                    <StyledTableCell component='th' scope='row'>{item.code}</StyledTableCell>
                                    <StyledTableCell>{item.validityStartDate}</StyledTableCell>
                                    <StyledTableCell>{item.validityEndDate}</StyledTableCell>
                                    <StyledTableCell align='right'>&#8377;{item.minimumOrderValue}</StyledTableCell>
                                    <StyledTableCell align='right'>{item.discountPercentage}%</StyledTableCell>
                                    <StyledTableCell align='right'>{item.active ? "Active" : "Inactive"}</StyledTableCell>
                                    <StyledTableCell align='right'>
                                        <Button onClick={() => handleDelete(item.id)}>
                                            <Delete className='text-[#00927c]' />
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={7} align="center">
                                    No coupons found.
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Coupon;
