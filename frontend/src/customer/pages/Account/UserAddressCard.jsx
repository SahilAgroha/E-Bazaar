import React from 'react'

const UserAddressCard = ({item}) => {
  return (
    <div className='p-5 border rounded-md flex'>
          
          <div className="space-y-3 ">
            <h1>{item.name}</h1>
            <p className="w-[320px">
                {item.address} {item.city} - {item.pinCode}, {item.state}
            </p>
            <p>{item.locality}</p>
            <p><strong>Mobile : </strong>{item.mobile}</p>
          </div>
    </div>
  )
}

export default UserAddressCard
