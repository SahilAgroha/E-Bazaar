import { Box, Button, FormControlLabel, Modal, Radio, RadioGroup } from '@mui/material';
import React, { useState, useEffect } from 'react';
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
    { value: "RAZORPAY", image: "https://razorpay.com/assets/razorpay-logo.svg" },
    { value: "STRIPE", image: "https://stripe.com/img/v3/home/twitter.png" }
];

const Checkout = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { cart } = useAppSelector(store => store);
    const { paymentOrder, loading, error } = useAppSelector(state => state.order);
    const { user } = useAppSelector(state => state.auth);

    const jwt = localStorage.getItem('jwt');

    const [open, setOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentGateway, setPaymentGateway] = useState("RAZORPAY");

    useEffect(() => {
        if (user && user.addresses?.length > 0 && !selectedAddress) {
            setSelectedAddress(user.addresses[0]);
        }
    }, [user]);
    const handleAddAddress = (values) => {
    console.log(values);

    // Example: dispatch to backend
    // dispatch(addAddress(values))

    setSelectedAddress(values); // optional
    setOpen(false); // close modal
};

    const handleCheckout = () => {

        if (!selectedAddress) {
            alert("Please select address");
            return;
        }

        if (!cart?.cart?.cartItems?.length) {
            alert("Cart is empty");
            return;
        }

        const addressPayload = selectedAddress.id
            ? { id: selectedAddress.id }
            : {
                name: selectedAddress.name,
                mobile: selectedAddress.mobile,
                pinCode: selectedAddress.pinCode,
                address: selectedAddress.address,
                city: selectedAddress.city,
                state: selectedAddress.state,
                locality: selectedAddress.locality,
            };

        dispatch(createOrder({
            address: addressPayload,
            jwt: jwt || "",
            paymentMethod: paymentGateway
        }));
    };

    useEffect(() => {
        if (paymentOrder?.payment_link_url) {
            window.location.href = paymentOrder.payment_link_url;
        }
    }, [paymentOrder]);

    return (
        <>
            <div className='pt-10 px-5 sm:px-10 md:px-44 lg:px-60 min-h-screen'>
                <div className="space-y-5 lg:grid grid-cols-3 lg:gap-9">
                    <div className="col-span-2 space-y-5">
                        <h1 className="font-semibold">Select Address</h1>

                        {user?.addresses?.map((item) => (
                            <AddressCard
                                key={item.id}
                                item={item}
                                isSelected={selectedAddress?.id === item.id || selectedAddress === item}
                                onSelect={() => setSelectedAddress(item)}
                            />
                        ))}

                        {/* Render locally added unsaved address */}
                        {selectedAddress && !selectedAddress.id && (
                            <AddressCard
                                item={selectedAddress}
                                isSelected={true}
                                onSelect={() => setSelectedAddress(selectedAddress)}
                            />
                        )}

                        <Button onClick={() => setOpen(true)}>Add New Address</Button>
                    </div>

                    <div>
                        <div className='space-y-3 border p-5 rounded-md'>
                            <h1 className='text-center font-semibold'>Payment Method</h1>
                            <RadioGroup row value={paymentGateway}
                                onChange={(e) => setPaymentGateway(e.target.value)}>
                                {PaymentGateway.map((item) => (
                                    <FormControlLabel
                                        key={item.value}
                                        value={item.value}
                                        control={<Radio />}
                                        label={<img src={item.image} alt="" width="80" />}
                                    />
                                ))}
                            </RadioGroup>
                        </div>

                        <div className='border rounded-md p-5 mt-5'>
                            <PricingCard cart={cart.cart} />
                            {error && <p className="text-red-500">{error}</p>}

                            <Button fullWidth variant='contained'
                                onClick={handleCheckout}
                                disabled={loading}
                                sx={{ mt: 2 }}>
                                {loading ? "Processing..." : "Checkout"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <AddressForm onFormSubmit={handleAddAddress}/>
                </Box>
            </Modal>
        </>
    );
};

export default Checkout;