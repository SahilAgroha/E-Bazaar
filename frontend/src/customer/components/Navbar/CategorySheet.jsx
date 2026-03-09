import React from 'react'

import { menLevelThree } from '../../../data/category/levelThree/menLevelThree'
import { womenLevelTwo } from '../../../data/category/levelTwo/womenLeveTwo'
import { furnitureLevelTwo } from '../../../data/category/levelTwo/furnitureLevelTwo'
import { menLevelTwo } from '../../../data/category/levelTwo/menLevelTwo'
import { womenLevelThree } from '../../../data/category/levelThree/womenLevelThree'
import { electronicsLevelThree } from '../../../data/category/levelThree/electronicsLevelThree'
import { furnitureLevelThree } from '../../../data/category/levelThree/furnitureLevelThree'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { electronicsLevelTwo } from '../../../data/category/levelTwo/electronicsLevelTwo'


const categoryTwo={
    men:menLevelTwo,
    women:womenLevelTwo,
    electronics:electronicsLevelTwo,
    home_furniture:furnitureLevelTwo,
}

const categoryThree = {
    men:menLevelThree,
    women:womenLevelThree,
    electronics:electronicsLevelThree,
    home_furniture:furnitureLevelThree,
}


const CategorySheet = ({selectedCategory,setShowSheet}) => {
    const childCategory = (category,parentCategoryId) => {
        return category.filter((child) => child.parentCategoryId === parentCategoryId)
    }
    const navigate=useNavigate();

  return (
    <Box sx={
        {zIndex:1}
    } className='bg-white shadow-lg lg:h-[500px] overflow-y-auto'>
        <div className='flex text-sm flex-wrap '>
            {
                categoryTwo[selectedCategory]?.map((item,index) => <div 
                className={`p-8 lg:w-[20%] ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                    <p className='text-[#00927c] mb-5 font-semibold'>{item.name}</p>
                    <ul className='space-y-3'>
                        {childCategory(categoryThree[selectedCategory],item.categoryId).map((item) =>
                        <div>
                            <li onClick={()=>navigate("/products/"+item.categoryId)} className='hover:text-[#00927C] cursor-pointer'>
                                {item.name}
                            </li>
                        </div>)
                        }

                        
                    </ul>
                    </div>)
            }

        </div>
      
    </Box>
  )
}

export default CategorySheet
