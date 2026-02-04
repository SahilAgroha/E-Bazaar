import React, { useEffect } from 'react'
import AdminDrawerList from '../../components/AdminDrawerList'
import AdminRoutes from '../../../Routes/AdminRoutes'
import { useAppDispatch } from '../../../State/Store'
import { fetchHomeCategories } from '../../../State/admin/adminSlice'

const AdminDashboard = () => {
  const dispatch=useAppDispatch();

  useEffect(()=>{
    dispatch(fetchHomeCategories())
  },[])

  const toggleDrawer=()=>{

  }
  return (
    <div>
      <div className="lg:flex lg:h[90vh]">
        <section className="0 lg:block h-full">
            <AdminDrawerList toggleDrawer={toggleDrawer}/>
        </section>
        <section className="p-10 w-full lg:w-[80%] overflow-y-auto">
            <AdminRoutes/>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
