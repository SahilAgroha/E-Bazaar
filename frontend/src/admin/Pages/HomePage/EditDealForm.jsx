import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { updateDeal } from "../../../State/admin/DealSlice";

const EditDealForm = ({ deal, onClose }) => {
  const dispatch = useAppDispatch();
  const { customer } = useAppSelector((store) => store);

  const formik = useFormik({
    initialValues: {
      discount: deal.discount || 0,
      category: deal.category?.id || ""
    },
    enableReinitialize: true, // ✅ important so it reloads if deal changes
    onSubmit: (values) => {
      const reqData = {
        id: deal.id,
        discount: Number(values.discount),
        category: { id: values.category }
      };
      dispatch(updateDeal(reqData));
      onClose(); // close edit mode after update
    }
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} className="space-y-6">
      <Typography variant="h5" className="text-center">
        Edit Deal
      </Typography>

      <TextField
        fullWidth
        type="number"
        name="discount"
        label="Discount"
        value={formik.values.discount}
        onChange={formik.handleChange}
      />

      <FormControl fullWidth>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
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

      <Button fullWidth sx={{ py: ".9rem" }} type="submit" variant="contained">
        Save Changes
      </Button>
      <Button fullWidth sx={{ py: ".9rem" }} onClick={onClose} variant="outlined">
        Cancel
      </Button>
    </Box>
  );
};

export default EditDealForm;