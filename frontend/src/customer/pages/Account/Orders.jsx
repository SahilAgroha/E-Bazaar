import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import { fetchUserOrderHistory } from '../../../State/customer/orderSlice';
import OrderItemCard from './OrderItemCard';

const Orders = () => {
  const dispatch=useAppDispatch();
  const {order}=useAppSelector(store=>store);

  console.log("order history  ",order)

  useEffect(()=>{
    dispatch(fetchUserOrderHistory(localStorage.getItem('jwt') || ''))
    console.log("fetching order history",order)
  },[])


  return (
    <div className='text-sm min-h-screen'>
      <div className="pb-5">
        <h1 className="font-semibold">All Orders</h1>
        <p>from anywhere</p>
      </div>
      <div className="space-y-2">
        {order.orders.map((order)=>order.orderItems.map((item)=><OrderItemCard item={item} order={order}/>))}
      </div>
      
    </div>
  )
}

export default Orders
