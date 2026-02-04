import React, { useEffect } from 'react';
import { Button, Card, CircularProgress, Divider, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../State/Store';


const Profile = () => {
  const dispatch = useAppDispatch();
  const { seller, auth } = useAppSelector(store => store);

  console.log('Seller Profile Data:', seller);
  

  if (seller.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (seller.error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <Typography variant="h6">Error loading seller profile: {seller.error}</Typography>
      </div>
    );
  }

  if (!seller.profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h6">No seller profile found. Please log in as a seller.</Typography>
      </div>
    );
  }

  return (
    <div className='p-5 md:p-10 lg:p-20 space-y-8'>
      {console.log('seller Account ',seller.profile)}
      <Typography variant="h4" className="text-center font-bold">Seller Profile</Typography>
      <Card className="p-8 rounded-lg shadow-lg">
        <Typography variant="h5" className="font-semibold text-gray-800 mb-4">Personal Information</Typography>
        <Divider className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Typography variant="body1" className="font-medium text-gray-600">Full Name:</Typography>
            <Typography variant="body1" className="text-gray-900">{seller.profile.sellerName}</Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="body1" className="font-medium text-gray-600">Email:</Typography>
            <Typography variant="body1" className="text-gray-900">{seller.profile.email}</Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="body1" className="font-medium text-gray-600">Role:</Typography>
            <Typography variant="body1" className="text-gray-900">{seller.profile.role}</Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="body1" className="font-medium text-gray-600">Mobile:</Typography>
            <Typography variant="body1" className="text-gray-900">{seller.profile.mobile}</Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="body1" className="font-medium text-gray-600">Company Name:</Typography>
            <Typography variant="body1" className="text-gray-900">{seller.profile.companyName}</Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="body1" className="font-medium text-gray-600">GSTIN:</Typography>
            <Typography variant="body1" className="text-gray-900">{seller.profile.gstin}</Typography>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="contained" color="primary">Edit Profile</Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;