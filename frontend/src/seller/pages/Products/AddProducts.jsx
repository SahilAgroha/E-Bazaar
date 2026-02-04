import { AddPhotoAlternate, Close } from '@mui/icons-material'
import { Button, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { uploadToCloudinary } from '../../../Util/UploadToCloudinary';
import {colors} from "../../../data/Filter/color"
import { sizes } from '../../../data/Filter/sizes';
import { mainCategory } from '../../../data/category/mainCategory';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { createProduct, fetchSellerProducts } from '../../../State/seller/sellerProductSlice';

const AddProducts = () => {
  const [uploadImage,setUploadingImage]=useState(false);
  const [snackbarOpen,setOpenSnackbar]=useState(false);
  const dispatch=useAppDispatch();
  const { loading } = useAppSelector(state => state.sellerProduct);

  const formik=useFormik({
    initialValues:{
      title:"",
      description:"",
      mrpPrice:"",
      sellingPrice:"",
      quantity:"",
      color:"",
      images:[],
      category:"",
      category2:"",
      category3:"",
      sizes:"",
    },
    onSubmit: async (values, { resetForm }) => {
          try {
            await dispatch(createProduct({ request: values, jwt: localStorage.getItem('jwt') }));
            // refresh seller product list after creating
            dispatch(fetchSellerProducts(localStorage.getItem('jwt')));
            resetForm();
          } catch (err) {
            console.error("Product create error", err);
          }
        }
      })
  
  const handleImageChange = async (event) => {
      const file = event.target.files[0]; // ✅ fix (was event.target.file)
      if (!file) return;
      setUploadingImage(true);
  
      try {
        const image = await uploadToCloudinary(file);
        formik.setFieldValue("images", [...formik.values.images, image]);
      } catch (err) {
        console.error("Cloudinary upload failed", err);
      } finally {
        setUploadingImage(false);
      }
    }
  
    const handleemoveImage = (index) => {
      const updatedImages = [...formik.values.images]
      updatedImages.splice(index, 1);
      formik.setFieldValue("images", updatedImages);
    }


  const childCategory=(category,parentCategoryId)=>{
    return category.filter((child)=>{
      return child.parentCategoryId==parentCategoryId;
    });
  };

  const handleCloseSnackbar=()=>{
    setOpenSnackbar(false);
  }

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
        <Grid container spacing={2}>

          <Grid className="flex flex-wrap gap-5" item xs={12}>
                      {/* ✅ Added id so label works */}
                      <input
                        type='file'
                        id="fileInput"
                        accept='image/*'
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                      />
                      <label className='relative' htmlFor='fileInput'>
                        <span className='w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400'>
                          <AddPhotoAlternate className='text-gray-700' />
                        </span>
                        {
                          uploadImage && (
                            <div className='absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center'>
                              <CircularProgress />
                            </div>
                          )}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {
                          formik.values.images.map((image, index) => (
                            <div className='relative' key={index}>
                              <img className='w-24 h-24 object-cover' src={image} alt={`ProductImage ${index + 1}`} />
                              <IconButton onClick={() => handleemoveImage(index)} className='' size='small' color='error'
                                sx={{ position: 'absolute', top: 0, right: 0, outline: "none" }}>
                                <Close sx={{ fontSize: "1rem" }} />
                              </IconButton>
                            </div>
                          ))
                        }
                      </div>
                    </Grid>
          
          <Grid size={{xs:12}}>
            <TextField fullWidth id='title' label='Title' value={formik.values.title} onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)} helperText={formik.touched.title && formik.errors.title} required/>
          </Grid>
          <Grid size={{xs:12}}>
            <TextField multiline rows={4}
            fullWidth id='description' label='Description' value={formik.values.description} onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)} helperText={formik.touched.description && formik.errors.description} required/>
          </Grid>
          <Grid size={{xs:12,md:6,lg:3}}>
            <TextField name='mrpPrice' type='number'
            fullWidth id='mrp_price' label='MRP Price' value={formik.values.mrpPrice} onChange={formik.handleChange}
            error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)} helperText={formik.touched.mrpPrice && formik.errors.mrpPrice} required/>
          </Grid>
          <Grid size={{xs:12,md:6,lg:3}}>
            <TextField name='sellingPrice' type='number'
            fullWidth id='sellingPrice' label='Selling Price' value={formik.values.sellingPrice} onChange={formik.handleChange}
            error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)} helperText={formik.touched.sellingPrice && formik.errors.sellingPrice} required/>
          </Grid>
          <Grid item size={{xs:12,md:4,lg:3}}>
            <TextField name='quantity' type='number'
              fullWidth id='quantity' label='Quantity' value={formik.values.quantity} onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)} helperText={formik.touched.quantity && formik.errors.quantity} required />
          </Grid>
          <Grid size={{xs:12,md:4,lg:3}}>
            <FormControl fullWidth error={formik.touched.color && Boolean(formik.errors.color)} required>
              <InputLabel id='color-label'>Color</InputLabel>
              <Select labelId='color-label' id='color' name='color' value={formik.values.color}
              onChange={formik.handleChange} label='Color'>
                <MenuItem value=''>
                  <em>None</em>
                </MenuItem>
                {
                  colors.map((color,index)=> <MenuItem value={color.name}>
                    <div className='flex gap-3'>
                      <span style={{backgroundColor:color.hex}} 
                      className={`h-5 w-5 rounded-full ${color.name==="White"?"border":""}`}></span>
                      <p>{color.name}</p>
                    </div>
                  </MenuItem>
                )}
              </Select>
              {
                formik.touched.color && formik.errors.color && (
                  <FormHelperText>{formik.errors.color}</FormHelperText>
                )
              }
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <FormControl
              error={formik.touched.sizes && Boolean(formik.errors.sizes)}
              fullWidth
              required
            >
    <InputLabel id="sizes-label">Sizes</InputLabel>
    <Select
      labelId="sizes-label"
      id="sizes"
      name="sizes"
      value={formik.values.sizes}
      onChange={formik.handleChange}
      label="Sizes"
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {sizes.map((size, index) => (
        <MenuItem key={index} value={size.name}>
          {size.name}
        </MenuItem>
      ))}
    </Select>
    {formik.touched.sizes && formik.errors.sizes && (
      <FormHelperText>{formik.errors.sizes}</FormHelperText>
    )}
  </FormControl>
</Grid>

          {/* Main Category */}
<Grid size={{xs:12,md:4,lg:4}}>
  <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)} required>
    <InputLabel id='category-label'>Category</InputLabel>
    <Select
      labelId='category-label'
      id='category'
      name='category'
      value={formik.values.category}
      onChange={(e) => {
        formik.handleChange(e);
        // reset child categories when parent changes
        formik.setFieldValue("category2", "");
        formik.setFieldValue("category3", "");
      }}
      label='Category'
    >
      {mainCategory.map((item) => (
        <MenuItem key={item.categoryId} value={item.categoryId}>{item.name}</MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

{/* Second Category */}
<Grid size={{xs:12,md:4,lg:4}}>
  <FormControl fullWidth error={formik.touched.category2 && Boolean(formik.errors.category2)} required>
    <InputLabel id='category2-label'>Second Category</InputLabel>
    <Select
      labelId='category2-label'
      id='category2'
      name='category2'
      value={formik.values.category2}
      onChange={(e) => {
        formik.handleChange(e);
        // reset third category when second changes
        formik.setFieldValue("category3", "");
      }}
      label='Category2'
      disabled={!formik.values.category} // disable until main selected
    >
      {mainCategory
        .find(cat => cat.categoryId === formik.values.category)?.levelTwoCategory?.map((sub) => (
          <MenuItem key={sub.categoryId} value={sub.categoryId}>{sub.name}</MenuItem>
        ))
      }
    </Select>
  </FormControl>
</Grid>

{/* Third Category (future expansion) */}
<Grid size={{xs:12,md:4,lg:4}}>
  <FormControl fullWidth error={formik.touched.category3 && Boolean(formik.errors.category3)} required>
    <InputLabel id='category3-label'>Third Category</InputLabel>
    <Select
      labelId='category3-label'
      id='category3'
      name='category3'
      value={formik.values.category3}
      onChange={formik.handleChange}
      label='Category3'
      disabled={!formik.values.category2} // disable until second selected
    >
      {mainCategory
        .flatMap(cat => cat.levelTwoCategory || [])
        .find(sub => sub.categoryId === formik.values.category2)?.levelThreeCategory?.map((third) => (
          <MenuItem key={third.categoryId} value={third.categoryId}>{third.name}</MenuItem>
        ))
      }
    </Select>
  </FormControl>
</Grid>

          <Grid size={{xs:12}}>
            <Button sx={{p:"14px"}} color='primary' variant='contained' fullWidth type='submit' disabled={loading}>
  {loading ? <CircularProgress size={20}/> : "Add Product"}
</Button>
          </Grid>

        </Grid>
      </form>
    </div>
  )
}

export default AddProducts
