import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { createDeal } from "../../../State/admin/DealSlice";

const CreateDealForm = () => {
  const dispatch = useAppDispatch();
  const { customer } = useAppSelector(store => store);

  const formik = useFormik({
    initialValues: { discount: 0, category: "" },
    onSubmit: (values) => {
      dispatch(createDeal({
        discount: Number(values.discount),
        category: { id: values.category }
      }));
    }
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <Typography variant="h5">Create Deal</Typography>

      <TextField
        fullWidth
        type="number"
        name="discount"
        label="Discount (%)"
        value={formik.values.discount}
        onChange={formik.handleChange}
      />

      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
        >
          {customer.homePageData?.dealCategories?.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" fullWidth>
        Create Deal
      </Button>
    </Box>
  );
};

export default CreateDealForm;