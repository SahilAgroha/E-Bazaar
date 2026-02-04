import { CheckCircle, FiberManualRecord } from '@mui/icons-material';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react'

const steps = [
  { name: "Order Placed", description: "on Thu, 11 Jul", value: "PLACED" },
  { name: "Order Confirmed", description: "on Thu, 11 Jul", value: "CONFIRMED" },
  { name: "Shipped", description: "Expected by Mon, 15 Jul", value: "SHIPPED" },
  { name: "Arriving", description: "Today by 6 PM", value: "Arriving" },
  { name: "Delivered", description: "Delivered on Tue, 16 Jul", value: "DELIVERED" },
];

const cancledStep=[
    { name: "Order Placed", description: "on Thu, 11 Jul", value: "PLACED" },
    {name:"Order Cancled",description:"on Thu, 11 Jul", value:"CANCLED"},
];

const currentStep=1;



const OrderStepper = ({orderStatus}) => {
    const [statusStep,setStatusStep]=useState(steps);
    useEffect(()=>{
        if(orderStatus==='CANCLED'){
            setStatusStep(cancledStep);
        } else {
            setStatusStep(steps);
        }
    },[orderStatus]);
  return (
    <Box className='mx-auto my-10'>
      {statusStep.map((step,index)=>(
        <>
            <div key={index} className={`flex px-4 `}>
                <div className="flex flex-col items-center">
                    <Box sx={{zIndex:-1}} 
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${index<=currentStep? "bg-gray-200 text-teal-500"
                        : "bg-gray-300 text-gray-600"
                    }`}>
                        {step.value===orderStatus?(<CheckCircle/>):(<FiberManualRecord sx={{zIndex:-1}}/>)}
                    </Box>
                    {
                        index<statusStep.length-1  && (
                            <div className={`border h-20 w-[2px] ${index<currentStep? 
                                "bg-[#00927c]" : "bg-gray-300 text-gray-600"
                            }`}
                            ></div>
                        )}
                </div>
                <div className="ml-2 w-full">
                    <div className={`${step.value===orderStatus ? "bg-[#00927c] p-2 text-white font-medium rounded-md -translate-y-3":""}
                        ${(orderStatus==='CANCLLED' && step.value===orderStatus)?"bg-red-500":""} w-full`}>
                    <p className=''>
                        {step.name}
                    </p>
                    <p className={`${step.value===orderStatus?"text-gray-200":"text-gray-500"} text-xs`}>
                        {step.description}
                    </p>

                    </div>
                </div>
            </div>
        </>
      ))}
    </Box>
  )
}

export default OrderStepper
