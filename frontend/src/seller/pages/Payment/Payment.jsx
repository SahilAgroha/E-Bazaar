import { Button, Card, Divider } from '@mui/material';
import React from 'react';
import Transaction from './Transaction';
import { useAppSelector } from '../../../State/Store';

const Payment = () => {
  const { transactions } = useAppSelector(store => store);

  // Calculate the total earning
  const totalEarning = transactions.transactions.reduce((sum, transaction) => {
    // Assuming each transaction object has an 'order' object with a 'totalSellingPrice'
    return sum + (transaction.order?.totalSellingPrice || 0);
  }, 0);

  // Find the last transaction to get the last payment amount
  const lastPayment = transactions.transactions.length > 0
    ? transactions.transactions[0].order?.totalSellingPrice || 0
    : 0;

  return (
    <div className='space-y-5'>
      <Card className='rounded-md space-y-4 p-5'>
        <h1 className="text-gray-600 font-medium">Total Earning</h1>
        <h1 className="font-black text-xl outline-blue-1">&#8377;{totalEarning}</h1>
        <Divider />
        <p className="text-gray-600 font-medium pt-1">Last Payment: <strong>&#8377;{lastPayment}</strong></p>
      </Card>
      <div className="pt-20">
        <Button variant='contained' sx={{ mb: 2 }}>
          Transaction
        </Button>
        <Transaction />
      </div>
    </div>
  );
};

export default Payment;