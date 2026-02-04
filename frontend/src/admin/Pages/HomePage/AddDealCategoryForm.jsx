import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../State/Store";
import {
  createHomeCategories,
  fetchHomePageData,
} from "../../../State/customer/customerSlice";
import { uploadToCloudinary } from "../../../Util/UploadToCloudinary";
import { mainCategory } from "../../../data/category/mainCategory";

const AddDealCategoryForm = () => {
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // Flatten categories for dropdown
  const allCategories = [];
  const flatten = (list) => {
    list.forEach((item) => {
      allCategories.push({ name: item.name, id: item.categoryId });
      if (item.levelTwoCategory) flatten(item.levelTwoCategory);
      if (item.levelThreeCategory) flatten(item.levelThreeCategory);
    });
  };
  flatten(mainCategory);


  const formik = useFormik({
    initialValues: { name: "", categoryId: "", image: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      categoryId: Yup.string().required("Required"),
      image: Yup.string().required("Image required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const homeCategory = {
        ...values,
        section: "DEALS", 
        parentCategoryId: "root",
      };

      await dispatch(createHomeCategories({ homeCategories: [homeCategory], jwt }));

      await dispatch(fetchHomePageData({ jwt }));

      resetForm();
      setImageUrl("");
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setUploading(false);
      if (url) {
        setImageUrl(url);
        formik.setFieldValue("image", url);
      }
    }
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} className="space-y-6">
      <Typography variant="h5" className="text-center">
        Add Deal Category
      </Typography>

      {/* Name */}
      <TextField
        fullWidth
        margin="normal"
        label="Category Name"
        {...formik.getFieldProps("name")}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />

      {/* Category ID */}
      <TextField
        select
        fullWidth
        margin="normal"
        label="Category ID"
        {...formik.getFieldProps("categoryId")}
        error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
        helperText={formik.touched.categoryId && formik.errors.categoryId}
      >
        {console.log("all categories ", allCategories)}
        {allCategories.map((opt) => (
          <MenuItem key={opt.id} value={opt.id}>
            {opt.name} ({opt.id})
          </MenuItem>
        ))}
      </TextField>

      {/* Upload Image */}
      <Button variant="contained" component="label" sx={{ mt: 2 }}>
        {uploading ? <CircularProgress size={20} /> : "Upload Image"}
        <input hidden type="file" accept="image/*" onChange={handleFileChange} />
      </Button>
      {imageUrl && (
        <Box mt={2}>
          <img src={imageUrl} alt="preview" className="h-20 rounded-md" />
        </Box>
      )}

      {/* Submit */}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Add Category
      </Button>
    </Box>
  );
};

export default AddDealCategoryForm;
