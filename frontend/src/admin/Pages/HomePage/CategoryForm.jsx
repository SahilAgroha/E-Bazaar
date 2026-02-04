import React, { useState, useEffect, useMemo } from "react";
import { Button, TextField, MenuItem, Box, CircularProgress, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../State/Store";
import {
  createHomeCategories,
  fetchHomePageData,
  updateHomeCategory,
} from "../../../State/customer/customerSlice";
import { uploadToCloudinary } from "../../../Util/UploadToCloudinary";
import { mainCategory } from "../../../data/category/mainCategory";

const CategoryForm = ({ editingCategory, setEditingCategory }) => {
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt");

  const [imageUrl, setImageUrl] = useState(editingCategory?.image || "");
  const [uploading, setUploading] = useState(false);

  // 🔑 Flatten categories into different levels
  const { level1, level2, level3, all } = useMemo(() => {
    const level1 = [];
    const level2 = [];
    const level3 = [];
    const all = [];

    const flatten = (list, level = 1) => {
      list.forEach((item) => {
        all.push({ name: item.name, id: item.categoryId, level });
        if (level === 1) level1.push({ name: item.name, id: item.categoryId });
        if (level === 2) level2.push({ name: item.name, id: item.categoryId });
        if (level === 3) level3.push({ name: item.name, id: item.categoryId });

        if (item.levelTwoCategory) flatten(item.levelTwoCategory, 2);
        if (item.levelThreeCategory) flatten(item.levelThreeCategory, 3);
      });
    };
    flatten(mainCategory);
    return { level1, level2, level3, all };
  }, []);

  useEffect(() => {
    if (editingCategory) {
      setImageUrl(editingCategory.image || "");
      formik.setValues({
        name: editingCategory.name || "",
        section: editingCategory.section || "",
        image: editingCategory.image || "",
        categoryId: editingCategory.categoryId || "",
      });
    }
  }, [editingCategory]);

  const formik = useFormik({
    initialValues: { name: "", section: "", image: "", categoryId: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      section: Yup.string().required("Required"),
      image: Yup.string().required("Image required"),
      categoryId: Yup.string().required("Category ID required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const homeCategory = { ...values, id: editingCategory?.id };

      if (editingCategory) {
        dispatch(updateHomeCategory({ id: editingCategory.id, homeCategory, jwt }))
          .unwrap()
          .then(() => dispatch(fetchHomePageData({ jwt })));
      } else {
        dispatch(createHomeCategories({ homeCategories: [homeCategory], jwt }))
          .unwrap()
          .then(() => dispatch(fetchHomePageData({ jwt })));
      }

      resetForm();
      setEditingCategory(null);
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

  // 🔑 Decide category options based on section
  const categoryOptions = useMemo(() => {
    switch (formik.values.section) {
      case "GRID":
        return all;
      case "SHOP_BY_CATEGORIES":
        return level1;
      case "ELECTRIC_CATEGORIES":
        return all.filter((c) => c.id.startsWith("electronics"));
      case "DEALS":
        return all;
      default:
        return [];
    }
  }, [formik.values.section, all, level1]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item size={{xs:12, sm:12}}>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        
        <Grid item size={{xs:12, sm:6}}>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Section"
            {...formik.getFieldProps("section")}
            error={formik.touched.section && Boolean(formik.errors.section)}
            helperText={formik.touched.section && formik.errors.section}
          >
            <MenuItem value="GRID">Grid</MenuItem>
            <MenuItem value="SHOP_BY_CATEGORIES">Shop By Categories</MenuItem>
            <MenuItem value="ELECTRIC_CATEGORIES">Electric Categories</MenuItem>
            <MenuItem value="DEALS">Deals</MenuItem>
          </TextField>
        </Grid>
        
        <Grid item size={{xs:12, sm:6}}>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Category ID"
            {...formik.getFieldProps("categoryId")}
            error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
            helperText={formik.touched.categoryId && formik.errors.categoryId}
            disabled={!formik.values.section}
          >
            {categoryOptions.map((opt) => (
              <MenuItem key={opt.id} value={opt.id}>
                {opt.name} ({opt.id})
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Buttons Container with flex layout */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Button variant="contained" component="label">
          {uploading ? <CircularProgress size={24} /> : "Upload Image"}
          <input hidden type="file" onChange={handleFileChange} />
        </Button>

        <Button type="submit" variant="contained" color="primary">
          {editingCategory ? "Update Category" : "Add Category"}
        </Button>
      </Box>

      {imageUrl && (
        <Box mt={2}>
          <img src={imageUrl} alt="preview" className="h-20 rounded-md" />
        </Box>
      )}
    </Box>
  );
};

export default CategoryForm;
