import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Rating, IconButton, Menu, MenuItem, Modal, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { Delete, Edit, MoreVert } from '@mui/icons-material';
import { deleteReview, updateReview } from '../../../State/customer/reviewSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ReviewCard = ({ review }) => {
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store);
    const jwt = localStorage.getItem('jwt');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openEditModal, setOpenEditModal] = useState(false);

    const isCurrentUser = auth.user?.id === review.user.id;

    const formik = useFormik({
        initialValues: {
            reviewText: review.reviewText,
            reviewRating: review.rating,
        },
        validationSchema: Yup.object({
            reviewText: Yup.string().required('Review cannot be empty'),
            reviewRating: Yup.number().min(1, 'Rating is required').required('Rating is required'),
        }),
        onSubmit: (values) => {
            const reviewData = {
                reviewText: values.reviewText,
                reviewRating: values.reviewRating,
            };
            if (review.id && jwt) {
                dispatch(updateReview({ reviewId: review.id, reviewData, jwt }));
                setOpenEditModal(false);
            }
        },
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            dispatch(deleteReview({ reviewId: review.id, jwt }));
        }
        handleClose();
    };

    const handleEdit = () => {
        setOpenEditModal(true);
        handleClose();
    };

    const handleEditModalClose = () => {
        setOpenEditModal(false);
        formik.resetForm();
    };
    
    return (
        <Card className="rounded-lg shadow-sm">
            <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                    <Avatar sx={{ bgcolor: deepOrange[500] }}>
                        {review.user.fullName.charAt(0)}
                    </Avatar>
                    <div className="flex-grow">
                        <Typography variant="h6" className="font-semibold">{review.user.fullName}</Typography>
                        <Rating value={review.rating} readOnly size="small" />
                    </div>
                    {isCurrentUser && (
                        <div>
                            <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-controls={open ? 'long-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <MoreVert />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'long-button',
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleEdit}>
                                    <Edit fontSize="small" className="mr-2" /> Edit
                                </MenuItem>
                                <MenuItem onClick={handleDelete}>
                                    <Delete fontSize="small" className="mr-2" /> Delete
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </div>
                <Typography variant="body1" className="text-gray-800">
                    {review.reviewText}
                </Typography>
                <Typography variant="caption" className="text-gray-500 block mt-2">
                    Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
            </CardContent>

            {/* Edit Review Modal */}
            <Dialog open={openEditModal} onClose={handleEditModalClose}>
                <DialogTitle>Edit Your Review</DialogTitle>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <Rating
                            name="reviewRating"
                            value={formik.values.reviewRating}
                            onChange={(event, newValue) => {
                                formik.setFieldValue("reviewRating", newValue);
                            }}
                            className="mb-4"
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            id="reviewText"
                            name="reviewText"
                            label="Your Review"
                            value={formik.values.reviewText}
                            onChange={formik.handleChange}
                            error={formik.touched.reviewText && Boolean(formik.errors.reviewText)}
                            helperText={formik.touched.reviewText && formik.errors.reviewText}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditModalClose}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? <CircularProgress size={24} /> : 'Update Review'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Card>
    );
};

export default ReviewCard;
