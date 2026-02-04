import React from 'react'
import { 
  AccountBox, 
  Add, 
  Category, 
  Dashboard, 
  ElectricBolt, 
  Home, 
  IntegrationInstructions, 
  LocalOffer, 
  Logout,
  People, // for Sellers
  Assessment, // for Reports
  Money,
  MoneyOff,
  MoneyRounded,
  MoneyOffCsred
} from '@mui/icons-material';
import DrawerList from './../../component/DrawerList'

const menu = [
  {
    name:"Dashboard",
    path:"/admin",
    icon: <Dashboard className='text-[#00927c]'/>,
    activeIcon: <Dashboard className='text-white'/>,
  },
  {
    name:"Coupons",
    path:"/admin/coupon",
    icon: <IntegrationInstructions className='text-[#00927c]'/>,
    activeIcon: <IntegrationInstructions className='text-white'/>,
  },
  {
    name:"Add New Coupon",
    path:"/admin/add-coupon",
    icon: <Add className='text-[#00927c]'/>,
    activeIcon:<Add className='text-white'/> ,
  },
  {
    name:"Home Page",
    path:"/admin/home-grid",
    icon: <Home className='text-[#00927c]'/>,
    activeIcon:<Home className='text-white'/> ,
  },
  {
    name:"Electronics Category",
    path:"/admin/electronics-category",
    icon: <ElectricBolt className='text-[#00927c]'/>,
    activeIcon:<ElectricBolt className='text-white'/> ,
  },
  {
    name:"Shop By Category",
    path:"/admin/shop-by-category",
    icon: <Category className='text-[#00927c]'/>,
    activeIcon:<Category className='text-white'/> ,
  },
  {
    name:"Deals",
    path:"/admin/deals",
    icon: <LocalOffer className='text-[#00927c]'/>,
    activeIcon: <LocalOffer className='text-white'/>,
  },
  // ✅ NEW: Seller Management
  {
    name:"Sellers",
    path:"/admin/sellers",
    icon: <People className='text-[#00927c]'/>,
    activeIcon: <People className='text-white'/>,
  },
  {
    name:"Transaction",
    path:"/admin/transaction",
    icon: <MoneyOff className='text-[#00927c]'/>,
    activeIcon: <MoneyOff className='text-white'/>,
  },
];

const menu2=[
  {
    name:"Account",
    path:"/admin/account",
    icon:<AccountBox className='text-[#00927c]'/>,
    activeIcon:<AccountBox className='text-white'/>,
  },
  {
    name:"Logout",
    path:"/",
    icon:<Logout className='text-[#00927c]'/>,
    activeIcon:<Logout className='text-white'/>,
  },
];

const AdminDrawerList = ({toggleDrawer}) => {
  return (
    <div>
      <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer}/>
    </div>
  )
}

export default AdminDrawerList
