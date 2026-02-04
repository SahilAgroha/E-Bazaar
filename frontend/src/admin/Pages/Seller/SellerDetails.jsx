import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { fetchSellerById, updateSellerStatus, deleteSeller } from '../../../State/seller/sellerSlice';
import { AccountStatus } from '../../../types/SellerTypes';
import {
    Paper,
    Typography,
    Grid,
    CircularProgress,
    Divider,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Card,
    CardContent,
    CardMedia,
    Avatar,
    Chip
} from '@mui/material';

const SellerDetails = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { selectedSeller, loading, error } = useAppSelector(store => store.seller);
    const jwt = localStorage.getItem('jwt');

    useEffect(() => {
        if (id) {
            dispatch(fetchSellerById(Number(id)));
        }
    }, [dispatch, id]);

    const handleStatusUpdate = (event) => {
        const status = event.target.value;
        if (selectedSeller && jwt) {
            dispatch(updateSellerStatus({ id: selectedSeller.id, status: status, jwt }));
        }
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete seller with ID: ${id}?`)) {
            if (selectedSeller) {
                dispatch(deleteSeller(selectedSeller.id));
                navigate('/admin/sellers');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING_VERIFICATION':
                return 'warning';
            case 'ACTIVE':
                return 'success';
            case 'SUSPENDED':
            case 'DEACTIVATED':
            case 'BANNED':
            case 'CLOSED':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading || !selectedSeller) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    // if (error) {
    //     return (
    //         <div className="flex justify-center items-center h-screen text-red-500">
    //             <Typography variant="h6">Error loading seller details: {error}</Typography>
    //         </div>
    //     );
    // }

    return (
        <div className="p-5 md:p-10 lg:p-20 space-y-8 bg-gray-100 min-h-screen">
            <Paper className="rounded-lg shadow-lg overflow-hidden">
                {/* Banner and Logo Section */}
                <Box className="relative h-48 sm:h-64 bg-gray-200">
                    <CardMedia
                        component="img"
                        image={selectedSeller.businessDetails.banner || "https://placehold.co/1200x300/E5E7EB/E5E7EB"}
                        alt="Seller Banner"
                        className="w-full h-full object-cover"
                    />
                    <Avatar
                        src={selectedSeller.businessDetails.logo || "https://placehold.co/100x100/A0AEC0/ffffff?text=Logo"}
                        sx={{
                            width: 120,
                            height: 120,
                            position: 'absolute',
                            bottom: -60,
                            left: 32,
                            border: '4px solid white',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    />
                </Box>
                
                <Box className="p-8 pt-20">
                    <div className="flex justify-between items-start mb-6 flex-wrap">
                        <Box className="space-y-1">
                            <Typography variant="h4" className="font-bold text-gray-800">
                                {selectedSeller.sellerName}
                            </Typography>
                            <Typography variant="h6" className="text-gray-600">
                                {selectedSeller.mobile}
                            </Typography>
                            <Chip 
                                label={selectedSeller.accountStatus.replace(/_/g, " ")} 
                                color={getStatusColor(selectedSeller.accountStatus)} 
                                className="mt-2"
                            />
                        </Box>
                        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                            <FormControl variant="outlined" sx={{ minWidth: 160 }}>
                                <InputLabel>Account Status</InputLabel>
                                <Select
                                    value={selectedSeller.accountStatus}
                                    onChange={handleStatusUpdate}
                                    label="Account Status"
                                >
                                    {Object.values(AccountStatus).map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status.replace(/_/g, " ")}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <Divider className="my-6" />

                    <Grid container spacing={4}>
                        {/* Business Details */}
                        <Grid item size={{xs:12, md:12}}>
                            <Card sx={{ backgroundColor: '#f0f4f8', boxShadow: 'none' }} className="h-full">
                                <CardContent>
                                    <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
                                        Business Details
                                    </Typography>
                                    <div className="space-y-3">
                                        <Typography><strong>Business Name:</strong> {selectedSeller.businessDetails.businessName}</Typography>
                                        <Typography><strong>Business Email:</strong> {selectedSeller.businessDetails.businessEmail}</Typography>
                                        <Typography><strong>Business Mobile:</strong> {selectedSeller.businessDetails.businessMobile}</Typography>
                                        <Typography><strong>Business Address:</strong> {selectedSeller.businessDetails.businessAddress}</Typography>
                                        <Typography><strong>GSTIN:</strong> {selectedSeller.gstin || "N/A"}</Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Bank Details */}
                        <Grid item size={{xs:12, md:12}}>
                            <Card sx={{ backgroundColor: '#f0f4f8', boxShadow: 'none' }} className="h-full">
                                <CardContent>
                                    <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
                                        Bank Information
                                    </Typography>
                                    <div className="space-y-3">
                                        <Typography><strong>Account Holder:</strong> {selectedSeller.bankDetails.accountHolderName}</Typography>
                                        <Typography><strong>Account Number:</strong> {selectedSeller.bankDetails.accountNumber}</Typography>
                                        <Typography><strong>IFSC Code:</strong> {selectedSeller.bankDetails.ifscCode}</Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        {/* Pickup Address */}
                        <Grid item size={{xs:12, md:12}}>
                            <Card sx={{ backgroundColor: '#f0f4f8', boxShadow: 'none' }}>
                                <CardContent>
                                    <Typography variant="h6" className="font-semibold text-gray-700 mb-4">
                                        Pickup Address
                                    </Typography>
                                    <div className="space-y-3">
                                        <Typography><strong>Name:</strong> {selectedSeller.pickupAddress.name}</Typography>
                                        <Typography><strong>Mobile:</strong> {selectedSeller.pickupAddress.mobile}</Typography>
                                        <Typography><strong>Address:</strong> {selectedSeller.pickupAddress.address}, {selectedSeller.pickupAddress.locality}, {selectedSeller.pickupAddress.city}, {selectedSeller.pickupAddress.state} - {selectedSeller.pickupAddress.pinCode}</Typography>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    
                    {/* Delete Seller Button */}
                    <Box mt={6} className="flex justify-end">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                        >
                            Delete Seller
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </div>
    );
};

export default SellerDetails;
