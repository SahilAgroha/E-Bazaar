import { Box, Button, FormControlLabel, Modal, Radio, RadioGroup } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import PricingCard from '../Cart/PricingCard';
import { createOrder } from '../../../State/customer/orderSlice';
import { useAppDispatch, useAppSelector } from '../../../State/Store';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const PaymentGateway = [
    {
        value: "RAZORPAY",
        image: "https://imgs.search.brave.com/vgLh1_hY8a1TDS_flOXU38N-xkycH_FHVyDLVsxt944/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cuZGF0YXJvYm90LmNvbS93cC1jb250ZW50L3VwbG9hZHMvMjAyNC8wMy9SYXpvcnBheV9sb2dvLTEwMjR4MjE3LnBuZw",
        label: ""
    },
    {
        value: "STRIPE",
        image: "https://imgs.search.brave.com/ycagYqgbO4lO7_7bcef5DIaACIzYOazI7bCZHBQKoa8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly8xMDAwbG9nb3MubmV0L3dwLWNvbnRlbnQvdXBsYWRzLzIwMjEvMDUvU3RyaXBlLWxvZ28tNTAweDI4MS5wbmc",
        label: ""
    }
];

const Checkout = () => {
    const dispatch = useAppDispatch();
    
    const navigate = useNavigate();
    const { cart,} = useAppSelector(store => store);
    const { paymentOrder, loading, error, auth } = useAppSelector(state => state.order);
    const { user } = useAppSelector(state => state.auth); // Assuming auth state has user object
    const jwt = localStorage.getItem('jwt');
    const [open, setOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentGateway, setPaymentGateway] = useState("RAZORPAY");

    useEffect(() => {
        // You can pre-select the first address if available
        if (user && user.addresses.length > 0 && selectedAddress === null) {
            setSelectedAddress(user.addresses[0]);
        }
    }, [user, selectedAddress]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handlePaymentChange = (event) => {
        setPaymentGateway(event.target.value);
    };

    const handleCheckout = () => {
        if (!selectedAddress) {
            console.error("Please select a shipping address.");
            // You should display a more user-friendly error message here
            return;
        }

        const addressPayload = {
            id: selectedAddress.id, // Pass the address ID if available
            name: selectedAddress.name,
            mobile: selectedAddress.mobile,
            pinCode: selectedAddress.pinCode,
            address: selectedAddress.address,
            city: selectedAddress.city,
            state: selectedAddress.state,
            locality: selectedAddress.locality,
        };

        dispatch(createOrder({ address: addressPayload, jwt: jwt || "", paymentGateway: paymentGateway }));
    };

    useEffect(() => {
        if (paymentOrder?.payment_link_url) {
            window.location.href = paymentOrder.payment_link_url;
        }
    }, [paymentOrder]);

    return (
        <>
            <div className='pt-10 px-5 sm:px-10 md:px-44 lg:px-60 min-h-screen'>
                <div className="space-y-5 lg:space-y-0 lg:grid grid-cols-3 lg:gap-9">
                    <div className="col-span-2 space-y-5">
                        <div className="flex justify-between items-center">
                            <h1 className="font-semibold">Select Address</h1>
                            <Button onClick={handleOpen}>
                                Add new Address
                            </Button>
                        </div>
                        <div className="text-xs font-medium space-y-5">
                            <p>Saved Address</p>
                            <div className='space-y-3'>
                                {user?.addresses?.map((item) => (
                                    <AddressCard
                                    key={item.id} // Use a unique key
                                    item={item}
                                    isSelected={selectedAddress?.id === item.id}
                                    onSelect={() => setSelectedAddress(item)} // Pass the function to update the state
                                />
                                ))}
                            </div>
                        </div>
                        <div className="py-4 px-5 rounded-md border">
                            <Button onClick={handleOpen}>
                                Add new Address
                            </Button>
                        </div>
                    </div>
                    <div className="">
                        <div>
                            <div className='space-y-3 border p-5 rounded-md'>
                                <h1 className='text-[#00927c] font-medium text-center pb-2 '>Chose Payment Gateway</h1>
                                <RadioGroup row aria-labelledby='demo-row-radio-buttons-group-label'
                                    name='row-radio-buttons-group'
                                    className='flex justify-between pr-0'
                                    onChange={handlePaymentChange}
                                    value={paymentGateway}>
                                    {PaymentGateway.map((item, index) =>
                                        <FormControlLabel className='border w-[45%] pr-2 rounded-md flex justify-center'
                                            key={index}
                                            value={item.value}
                                            control={<Radio />}
                                            label={
                                                <img src={item.image} alt={item.label} className={`${item.value == "STRIPE" ? "w-14" : ""}`} />
                                            }
                                        />)}
                                </RadioGroup>
                            </div>
                        </div>
                        <div className='border rounded-md p-5 '>
                            <PricingCard cart={cart.cart}/>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            <div className='p-5'>
                                <Button fullWidth variant='contained' sx={{ py: "11px" }} onClick={handleCheckout} disabled={loading}>
                                    {loading ? 'Processing...' : 'Checkout'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <AddressForm onFormSubmit={(address) => {
                        setSelectedAddress(address);
                        handleClose();
                        handleCheckout();
                    }} />
                </Box>
            </Modal>
        </>
    );
};

export default Checkout;