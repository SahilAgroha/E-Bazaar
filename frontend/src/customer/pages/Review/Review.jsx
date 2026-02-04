import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Rating,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchProductReviews, writeReview } from '../../../State/customer/reviewSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { useParams } from 'react-router-dom';
import ReviewCard from './ReviewCard';

const Review = () => {
    const { productId } = useParams();
    const dispatch = useAppDispatch();
    const { reviews, loading, error, reviewCreated } = useAppSelector(store => store.reviews);
    const { auth } = useAppSelector(store => store);
    const jwt = localStorage.getItem('jwt');



    const [open, setOpen] = useState(false);
    const [filterRating, setFilterRating] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        if (productId) {
            // Dispatch with filters and sort options
            dispatch(fetchProductReviews(Number(productId)));
        }
    }, [dispatch, productId, filterRating, sortBy, sortOrder]);
    
    useEffect(() => {
        if (reviewCreated) {
            setOpen(false);
            dispatch(fetchProductReviews({ productId: Number(productId), filterRating, sortBy, sortOrder }));
            dispatch({ type: 'reviews/resetReviewState' });
        }
    }, [reviewCreated, dispatch, productId, filterRating, sortBy, sortOrder]);

    const formik = useFormik({
        initialValues: {
            reviewText: '',
            reviewRating: 0,
        },
        validationSchema: Yup.object({
            reviewText: Yup.string().required('Review cannot be empty'),
            reviewRating: Yup.number().min(1, 'Rating is required').required('Rating is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            const reviewData = {
                reviewText: values.reviewText,
                reviewRating: values.reviewRating,
            };
            if (productId && jwt) {
                dispatch(writeReview({ productId: Number(productId), reviewData, jwt }));
            }
            resetForm();
        },
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    // if (error) {
    //     return (
    //         <div className="flex justify-center items-center h-screen text-red-500">
    //             <Typography variant="h6">Error: {error}</Typography>
    //         </div>
    //     );
    // }

    // Calculate total and average rating for summary
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : 0;

    return (
        <div className="p-5 md:p-10 lg:p-20 space-y-8 bg-gray-100 min-h-screen">
            <Paper className="p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                {/* Header and Summary */}
                <Box className="flex justify-between items-center mb-6 flex-wrap space-y-4 sm:space-y-0">
                    <Typography variant="h4" className="font-bold text-gray-800">Product Reviews</Typography>
                    <div className="flex items-center space-x-4">
                        <Rating value={Number(averageRating)} readOnly precision={0.5} />
                        <Typography variant="h6" className="text-gray-600">
                            {averageRating} out of 5 stars
                        </Typography>
                    </div>
                </Box>
                <Typography variant="body1" className="text-gray-500 mb-6">{totalReviews} total ratings</Typography>
                <Divider />

                <div className="flex justify-between items-center flex-wrap my-8 space-y-4 md:space-y-0">
                    {/* Filter and Sort Section */}
                    <div className="flex items-center space-x-4">
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel id="filter-rating-label">Filter by Rating</InputLabel>
                            <Select
                                labelId="filter-rating-label"
                                value={filterRating}
                                label="Filter by Rating"
                                onChange={(e) => setFilterRating(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                {[5, 4, 3, 2, 1].map(rating => (
                                    <MenuItem key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel id="sort-by-label">Sort By</InputLabel>
                            <Select
                                labelId="sort-by-label"
                                value={sortBy}
                                label="Sort By"
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="rating">Rating</MenuItem>
                                <MenuItem value="date">Date</MenuItem>
                            </Select>
                        </FormControl>
                        {sortBy && (
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel id="sort-order-label">Order</InputLabel>
                                <Select
                                    labelId="sort-order-label"
                                    value={sortOrder}
                                    label="Order"
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <MenuItem value="desc">Descending</MenuItem>
                                    <MenuItem value="asc">Ascending</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </div>

                    {auth.user && (
                        <Button variant="contained" onClick={handleOpen}>
                            Write a Review
                        </Button>
                    )}
                </div>
                
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Write Your Review</DialogTitle>
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
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
                                {formik.isSubmitting ? <CircularProgress size={24} /> : 'Submit Review'}
                            </Button>
                        </DialogActions>
                    </Box>
                </Dialog>

                <Grid container spacing={4}>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <Grid item xs={12} key={review.id}>
                                <ReviewCard review={review} />
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12} className="text-center">
                            <Typography variant="h6" className="text-gray-500">No reviews yet. Be the first!</Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </div>
    );
};

export default Review;
