import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box, Button, Grid, TextField, CircularProgress,
  Typography, Paper, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../State/Store';
import { createHomeCategories } from '../../../State/customer/customerSlice';
import { uploadToCloudinary } from '../../../Util/UploadToCloudinary';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Category name is required'),
  section: Yup.string().required('Section is required'),
  image: Yup.string().required('Image is required'),
  categoryId: Yup.string().required('Category ID is required'),
});

const homeCategorySections = [
  "GRID",
  "SHOP_BY_CATEGORIES",
  "ELECTRIC_CATEGORIES",
  "DEALS"
];

const CreateHomeCategory = () => {
  const dispatch = useAppDispatch();
  const { admin } = useAppSelector(store => store); // ✅ using admin slice
  const jwt = localStorage.getItem('jwt');
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const formik = useFormik({
    initialValues: { name: '', section: '', image: '', categoryId: '' },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const homeCategories = [{ ...values }];
      try {
        await dispatch(createHomeCategories({ homeCategories, jwt })).unwrap();
        setSuccessMsg("✅ Category created successfully!");
        resetForm();
      } catch (err) {
        setSuccessMsg(""); // clear on error
      }
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadToCloudinary(file);
    if (url) formik.setFieldValue('image', url);
    setUploading(false);
  };

  return (
    <Paper className='p-8 rounded-lg shadow-lg max-w-2xl mx-auto my-10'>
      <Typography variant="h4" className="text-center font-bold text-gray-800 mb-6">
        Create New Home Category
      </Typography>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          {/* Category Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth id="name" name="name" label="Category Name"
              value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>

          {/* Section */}
          <Grid item xs={12}>
            <FormControl
              fullWidth error={formik.touched.section && Boolean(formik.errors.section)}
            >
              <InputLabel id="section-label">Section</InputLabel>
              <Select
                labelId="section-label" id="section" name="section"
                value={formik.values.section} onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {homeCategorySections.map((section) => (
                  <MenuItem key={section} value={section}>{section}</MenuItem>
                ))}
              </Select>
              {formik.touched.section && formik.errors.section && (
                <Typography variant="caption" color="error">{formik.errors.section}</Typography>
              )}
            </FormControl>
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <Button variant="outlined" component="label" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Image"}
              <input type="file" hidden onChange={handleFileUpload} />
            </Button>
            {formik.values.image && (
              <img src={formik.values.image} alt="preview" className="w-32 mt-2 rounded-md" />
            )}
            {formik.touched.image && formik.errors.image && (
              <Typography color="error" variant="caption">{formik.errors.image}</Typography>
            )}
          </Grid>

          {/* Category ID */}
          <Grid item xs={12}>
            <TextField
              fullWidth id="categoryId" name="categoryId" label="Category ID"
              value={formik.values.categoryId} onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
              helperText={formik.touched.categoryId && formik.errors.categoryId}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit" variant="contained" color="primary" fullWidth
              sx={{ padding: '0.8rem 0' }}
              disabled={admin.loading || uploading}
            >
              {admin.loading ? <CircularProgress size={24} /> : 'Create Category'}
            </Button>
          </Grid>
        </Grid>

        {/* Error or Success messages */}
        {admin.error && (
          <Typography color="error" className="mt-4 text-center">{admin.error}</Typography>
        )}
        {successMsg && (
          <Typography color="primary" className="mt-4 text-center">{successMsg}</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default CreateHomeCategory;
