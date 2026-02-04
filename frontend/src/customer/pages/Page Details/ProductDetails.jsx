import {
    Add, AddShoppingCart, FavoriteBorder,
    LocalShipping, Remove, Shield, Wallet, WorkspacePremium
} from '@mui/icons-material';
import {
    Button, Divider, CircularProgress, Typography, Rating,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SimilarProduct from './SimilarProduct';
import ReviewCard from '../Review/ReviewCard';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById } from '../../../State/customer/ProductSlice';
import { addItemToCart } from '../../../State/customer/cartSlice';
import { addProductToWishlist } from '../../../State/customer/wishlistSlice';
import { fetchProductReviews, writeReview } from '../../../State/customer/reviewSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import "./ProductDetails.css";

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("M");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { productId } = useParams();

    const { product } = useAppSelector(store => store);
    const { reviews } = useAppSelector(store => store);
    const { auth } = useAppSelector(store => store);
    const sizes= product.product?.sizes || "S,M,L,XL,XXL".split(",");
    console.log("sizes ", product);
    const jwt = localStorage.getItem('jwt');
    const [activeImage, setActiveImage] = useState(0);
    const [openAddReviewModal, setOpenAddReviewModal] = useState(false);

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductById(Number(productId)));
            dispatch(fetchProductReviews(Number(productId)));
        }
    }, [productId, dispatch]);

    const handleActiveImage = (value) => () => setActiveImage(value);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size before adding to bag!");
            return;
        }
        if (product?.product) {
            dispatch(addItemToCart({
                jwt,
                request: {
                    productId: product.product?.id,
                    quantity,
                    size: selectedSize,
                },
            }));
        }
    };

    const handleAddToWishlist = () => {
        if (!product?.product?.id) {
            alert("Invalid product.");
            return;
        }
        dispatch(addProductToWishlist({ productId: product.product.id }));
    };

    const totalReviews = reviews.reviews?.length || 0;
    const averageRating = totalReviews > 0
        ? (reviews?.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
        : 0;

    const initialReviews = reviews?.reviews?.slice(0, 3) || [];

    const reviewFormik = useFormik({
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
            setOpenAddReviewModal(false);
            resetForm();
        },
    });

    if (product.loading) {
        return (
            <div className="loading-container">
                <CircularProgress />
            </div>
        );
    }

    if (product.error) {
        return (
            <div className="error-container">
                <Typography variant="h6">Error loading product details: {product.error}</Typography>
            </div>
        );
    }

    return (
        <div className="product-details-container">
            {/* UPPER HALF */}
            <div className="upper-half">
                {/* LEFT: IMAGES */}
                <section className="image-section">
                    <div className="main-image">
                        <img
                            src={product.product?.images[activeImage]}
                            alt="main product"
                        />
                    </div>
                    <div className="thumbnail-row">
                        {product.product?.images?.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`thumb-${idx}`}
                                onClick={handleActiveImage(idx)}
                                className={idx === activeImage ? "thumbnail active" : "thumbnail"}
                            />
                        ))}
                    </div>
                </section>

                {/* RIGHT: INFO */}
                <section className="info-section">
                    <div className="seller-title">
                        <h1>{product.product?.seller?.businessDetails?.businessName}</h1>
                        <Typography variant="h5">{product.product?.title}</Typography>
                    </div>

                    <div className="rating-row">
                        <Rating name="read-only" value={Number(averageRating)} readOnly precision={0.5} />
                        <Typography variant="body2">
                            ({totalReviews} Ratings) {averageRating > 0 && `• ${averageRating}/5`}
                        </Typography>
                    </div>

                    {/* Price */}
                    <Box className="price-box">
                        <span className="price">₹{product.product?.sellingPrice}</span>
                        <span className="mrp">₹{product.product?.mrpPrice}</span>
                        <span className="discount">{product.product?.discountPercentage}% Off</span>
                        <Typography variant="body2" className="tax-note">
                            Inclusive of all taxes. Free Shipping above ₹1500
                        </Typography>
                    </Box>

                    <Divider />

                    {/* Highlights */}
                    <div className="highlights">
                        <div><Shield /> <p>Authentic & Quality Assured</p></div>
                        <div><WorkspacePremium /> <p>100% money back guarantee</p></div>
                        <div><LocalShipping /> <p>Free Shipping & Returns</p></div>
                        <div><Wallet /> <p>Pay on delivery might be available</p></div>
                    </div>

                    <Divider />

                    {/* Size Selector */}
                    <Box className="size-box">
                        <Typography variant="h6">SELECT SIZE</Typography>
                        <div className="size-row">
                            {[1,1,1].map((size, index) => (
                                <Button
                                    key={index}
                                    variant={selectedSize === size ? "contained" : "outlined"}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                    </Box>

                    {/* Quantity */}
                    <Box className="quantity-box">
                        <Typography variant="h6">QUANTITY</Typography>
                        <div className="quantity-controls">
                            <Button disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)}>
                                <Remove />
                            </Button>
                            <Typography>{quantity}</Typography>
                            <Button onClick={() => setQuantity(quantity + 1)}>
                                <Add />
                            </Button>
                        </div>
                    </Box>

                    {/* Buttons */}
                    <div className="action-buttons">
                        <Button fullWidth variant="contained" startIcon={<AddShoppingCart />} onClick={handleAddToCart}>
                            Add To Bag
                        </Button>
                        <Button fullWidth variant="outlined" startIcon={<FavoriteBorder />} onClick={handleAddToWishlist}>
                            Wishlist
                        </Button>
                    </div>

                    {/* Description */}
                    <Box className="description-box">
                        <Typography variant="h6">Product Details</Typography>
                        <Typography variant="body1">{product.product?.description}</Typography>
                    </Box>
                </section>
            </div>

            {/* REVIEWS */}
            <div className="review-section">
                <Box className="review-header">
                    <Typography variant="h5">Recent Reviews ({totalReviews})</Typography>
                    {auth.user && (
                        <Button variant="contained" onClick={() => setOpenAddReviewModal(true)}>
                            Write a Review
                        </Button>
                    )}
                </Box>

                {/* Review Dialog */}
                <Dialog open={openAddReviewModal} onClose={() => setOpenAddReviewModal(false)}>
                    <DialogTitle>Write Your Review</DialogTitle>
                    <Box component="form" onSubmit={reviewFormik.handleSubmit}>
                        <DialogContent>
                            <Rating
                                name="reviewRating"
                                value={reviewFormik.values.reviewRating}
                                onChange={(event, newValue) => {
                                    reviewFormik.setFieldValue("reviewRating", newValue);
                                }}
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                id="reviewText"
                                name="reviewText"
                                label="Your Review"
                                value={reviewFormik.values.reviewText}
                                onChange={reviewFormik.handleChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenAddReviewModal(false)}>Cancel</Button>
                            <Button type="submit" variant="contained">Submit Review</Button>
                        </DialogActions>
                    </Box>
                </Dialog>

                {/* Review List */}
                {initialReviews.length > 0 ? (
                    initialReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))
                ) : (
                    <Typography>No reviews yet. Be the first to review this product!</Typography>
                )}

                {totalReviews > 3 && (
                    <Button variant="outlined" onClick={() => navigate(`/reviews/${productId}`)}>
                        View All Reviews
                    </Button>
                )}
            </div>

            {/* SIMILAR PRODUCTS */}
            <div className="similar-products">
                <h1>Similar Products</h1>
                <SimilarProduct />
            </div>
        </div>
    );
};

export default ProductDetails;
