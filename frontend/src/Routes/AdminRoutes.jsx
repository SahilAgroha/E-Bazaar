import React from 'react'
import { Route, Routes } from 'react-router-dom'

// Existing imports
import SellerTable from '../admin/Pages/Seller/SellerTable'
import Coupon from '../admin/Pages/Coupon/Coupon'
import AddNewCouponForm from '../admin/Pages/Coupon/AddNewCouponForm'
import GridTable from '../admin/Pages/HomePage/GridTable'
import ElectronicTable from '../admin/Pages/HomePage/ElectronicTable'
import ShopByCategoryTable from '../admin/Pages/HomePage/ShopByCategoryTable'
import Deal from '../admin/Pages/HomePage/Deal'
import CreateDealForm from '../admin/Pages/HomePage/CreateDealForm'
import CreateHomeCategory from '../admin/Pages/HomePage/CreateHomeCategory'
import AdminHomeCategories from '../admin/Pages/HomePage/AdminHomeCategories'
import AdminDashboard from '../admin/Pages/HomePage/AdminDashboard'
import GlobalDashboard from '../admin/Pages/Seller/GlobalDashboard'
import SellerDetails from '../admin/Pages/Seller/SellerDetails'
import AdminAccount from '../admin/Pages/AdminAccount'
import AdminAllTransactions from '../admin/Pages/AdminAllTransactions'

// New imports


const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        {/* Default */}
        <Route path='/' element={<AdminHomeCategories />} /> {/* Done */}

        {/* Coupons */}
        <Route path='/coupon' element={<Coupon />} /> {/* Done */}
        <Route path='/add-coupon' element={<AddNewCouponForm />} /> {/* Done */}

        {/* Homepage sections */}
        <Route path='/home-grid' element={<GridTable />} /> {/* Done */}
        <Route path='/electronics-category' element={<ElectronicTable />} /> {/* Done */}
        <Route path='/shop-by-category' element={<ShopByCategoryTable />} /> {/* Done */}
        <Route path='/deals' element={<Deal />} /> {/* Deals Management */}

        {/* Seller Management */}
        <Route path='/sellers' element={<SellerTable />} /> {/* List of all sellers */}
        <Route path='/sellers/:id' element={<SellerDetails />} /> {/* Individual Seller Report */}

        <Route path='/transaction' element={<AdminAllTransactions />} /> {/* Done */}

        <Route path='/account' element={<AdminAccount />} /> {/* Done */}

      </Routes>
    </div>
  )
}

export default AdminRoutes
