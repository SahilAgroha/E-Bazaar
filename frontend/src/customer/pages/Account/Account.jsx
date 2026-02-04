import { Divider } from '@mui/material'
import React from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Orders from './Orders'
import OrderDetails from './OrderDetails'
import UserDetails from './UserDetails'
import Address from './Address'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import { logout } from '../../../State/AuthSlice'

const menu=[
  {name:"orders", path:"/account/orders"},
  {name:"profile", path:"/account/"},
  {name:"Saved Cards", path:"/account/saved-card"},
  {name:"Addresses", path:"/account/addresses"},
  {name:"Logout", path:"/"},

]

const Account = () => {
  const navigate=useNavigate()
  const location=useLocation()
  const dispatch=useAppDispatch();
  const {auth}=useAppSelector(store=>store)
  console.log('auth in account ',auth)
  

  const handleClick=(item)=>{
    if(item.path==='/'){
      dispatch(logout(navigate))
    }
    navigate(item.path)
  }
  return (
    <div className='px-5 lg:px-52 min-h-screen mt-10'>
      <div>
        <h1 className="text-xl font-bold pb-5">{auth.user?.fullName}</h1>
      </div>
      <Divider/>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:min-h-[78vh]">
        <section className="col-span-1 lg:border-r lg:pr-5 py-5 h-full">
          {console.log('menu -- ',menu)}
          {
            menu.map((item)=>(
              <div key={item.name} onClick={()=>handleClick(item)}
              className={`${item.path===location.pathname ? "bg-[#00927c] text-white" : ""} 
              py-3 cursor-pointer hover:text-white hover:bg-[#00927c] px-5 rounded-md border-b`}>
                <p>{item.name}</p>
              </div>
            ))
          }
        </section>
        <section className="right lg:col-span-2 lg:pl-5 py-5">
          <Routes>
            <Route path='/' element={<UserDetails/>}/> 
            <Route path='/orders' element={<Orders/>}/> 
            <Route path='/order/:orderId/:orderItemId' element={<OrderDetails/>}/> 
            <Route path='/addresses' element={<Address/>}/>
          </Routes>
          {/* <Orders/> */}
          {/* <OrderDetails/> */}
          {/* <UserDetails/> */}
          {/* <Address/> */}
        </section>
      </div>
    </div>

  )
}

export default Account
