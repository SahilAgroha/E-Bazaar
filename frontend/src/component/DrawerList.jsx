import { Divider, ListItem, ListItemText } from "@mui/material"
import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../State/Store";
import { logout } from "../State/AuthSlice";

const DrawerList = ({menu,menu2,toggleDrawer}) => {
  const location=useLocation();
  const navigate=useNavigate();
  const dispatch=useAppDispatch();

  const handleLogout=()=>{
    dispatch(logout(navigate));
  }


  return (
    <div className='h-full'>
        <div className="flex flex-col justify-between h-full w-[300px] border-r py-5">
            <div>
                <div className="space-y-2">
                  {
                    menu.map((item,index)=><div onClick={()=>navigate(item.path)} className="pr-9 cursor-pointer" key={index}>
                      <p className={`${item.path==location.pathname?"bg-[#00927c] text-white": "text-[#00927c]"} flex items-center px-5 py-3 rounded-r-full`}>
                        <ListItem>{item.path==location.pathname?item.activeIcon:item.icon}</ListItem>
                        <ListItemText primary={item.name}/>
                      </p>
                    </div>
                    )}
                </div>
            </div>
        </div>
        <Divider/>
        
        <div className="flex flex-col justify-between h-full w-[300px] border-r py-5">
            <div>
                <div className="space-y-2">
                  {
                    menu2.map((item,index)=><div onClick={()=>{
                      navigate(item.path)
                      if(item.path=='/') handleLogout();
                    }} className="pr-9 cursor-pointer" key={index}>
                      <p className={`${item.path==location.pathname?"bg-[#00927c] text-white": "text-[#00927c]"} flex items-center px-5 py-3 rounded-r-full`}>
                        <ListItem>{item.path==location.pathname?item.activeIcon:item.icon}</ListItem>
                        <ListItemText primary={item.name}/>
                      </p>
                    </div>
                    )}
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default DrawerList
