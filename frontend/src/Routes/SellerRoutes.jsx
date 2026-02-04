
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../seller/pages/SellerDashboard/Dashboard'
import AddProducts from '../seller/pages/Products/AddProducts'
import Products from '../seller/pages/Products/Products'
import Transaction from '../seller/pages/Payment/Transaction'
import Payment from '../seller/pages/Payment/Payment'
import Profile from '../seller/pages/Account/Profile'
import Orders from '../seller/pages/Orders/Orders'
import SellerProfile from '../seller/pages/SellerDashboard/SellerProfile'

const SellerRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/products' element={<Products/>}/>
            <Route path='/add-product' element={<AddProducts/>}/>
            <Route path='/orders' element={<Orders/>}/>
            <Route path='/account' element={<SellerProfile/>}/>
            <Route path='/payment' element={<Payment/>}/>  
            <Route path='/transaction' element={<Transaction/>}/>  
        </Routes>
      
    </div>
  )
}

export default SellerRoutes
