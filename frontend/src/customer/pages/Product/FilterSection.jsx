import { Button, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import React, { useState } from 'react'
import {colors} from '../../../data/Filter/color'
import { price } from '../../../data/Filter/price'
import { discount } from '../../../data/Filter/discounts'
import { useSearchParams } from 'react-router-dom'

const FilterSection = () => {
  const [expendColor,setExpendColor]=useState(false)
  const [searchParams,setSearchParams]=useSearchParams();

  const handleColorToggle=()=>{
    setExpendColor(!expendColor)
  }
  const updateFilterParams=(event)=>{
    const {value,name}=event.target;
    if(value){
      searchParams.set(name,value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters=()=>{
    console.log("clear all filters", searchParams);
    searchParams.forEach((value,key)=>{
      searchParams.delete(key);
    });
    setSearchParams(searchParams);
  };
  return (
    <div className='-z-50 space-y-5 bg-white'>
      <div className="flex items-center justify-between h-[40px] px-9 lg:border-r">
        <p className="text-lg font-semibold">
          Filters
        </p>
        <button onClick={clearAllFilters} size='small' className='text-teal-600 cursor-pointer font-semibold' >
          clear all
        </button>
      </div>

      <Divider/>

      <div className="px-9 space-y-6">
      <section>
        <FormControl>
          <FormLabel sx={{fontSize:"16px",fontWeight:"bold", color:"teal",pb:"14px"}} className='text-2xl font-semibold' id='color'>
            Color</FormLabel>
          <RadioGroup aria-labelledby='color' defaultValue='' name='color' onChange={updateFilterParams}>
            {
              colors.slice(0,expendColor?colors.length:5).map((item) => <FormControlLabel key={item.name} value={item.name} control={<Radio/>} 
              label={<div className='flex items-center gap-3'>
                <p>{item.name}</p>
                <p style={{backgroundColor:item.hex}}
                className={`h-5 w-5 rounded-full ${item.name==="White"?"border":""}`}></p>
              </div>}
               />)
            }
            
          </RadioGroup>
        </FormControl>
        <div>
          <Button className='text-[#00927c] cursor-pointer hover:text-teal-900 flex items-center' onClick={handleColorToggle}>
            {expendColor?"hide":`+${colors.length-5} more`}</Button>
        </div>
      </section>

      <section>
        <FormControl>
        <FormLabel sx={{fontSize:"16px",fontWeight:"bold", color:"teal",pb:"14px"}} className='text-2xl font-semibold' id='price'>
          Price
        </FormLabel>
        <RadioGroup name='price' onChange={updateFilterParams} defaultValue="" aria-labelledby='price'>
          {price.map((item) => <FormControlLabel key={item.name} value={item.value} control={<Radio size='small'/>}  label={item.name}/>)}
        </RadioGroup>
        </FormControl>
      </section>

      <Divider/>
      <section>
        <FormControl>
          <FormLabel sx={{fontSize:"16px",fontWeight:"bold", color:"teal",pb:"14px"}} className='text-2xl font-semibold' id='brand'>
            Discount
          </FormLabel>
          <RadioGroup name='Discount' onChange={updateFilterParams} defaultValue="" aria-labelledby='brand'>
            {discount.map((item) => <FormControlLabel key={item.name} value={item.value} control={<Radio size='small'/>} label={item.name}/>)}
          </RadioGroup>
        </FormControl>
      </section>


      </div>

    </div>
  )
}

export default FilterSection
