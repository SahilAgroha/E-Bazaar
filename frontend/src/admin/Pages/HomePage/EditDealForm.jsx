import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Divider,
  Paper
} from "@mui/material";
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
      category: deal.category?.id || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(
        updateDeal({
          id: deal.id,
          deal: {
            discount: Number(values.discount),
            category: { id: values.category },
          },
        })
      );
      onClose();
    },
  });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        background: "linear-gradient(to right, #f8fafc, #eef2f7)",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        ✨ Edit Deal Details
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={formik.handleSubmit}>
        {/* Discount */}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Discount Percentage
        </Typography>
        <TextField
          fullWidth
          type="number"
          name="discount"
          placeholder="Enter discount"
          value={formik.values.discount}
          onChange={formik.handleChange}
          sx={{
            mb: 4, // ✅ SPACE ADDED
            backgroundColor: "white",
            borderRadius: 2,
          }}
          InputProps={{
            endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
          }}
        />

        {/* Category */}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Deal Category
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Category</InputLabel>
          <Select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            sx={{ backgroundColor: "white", borderRadius: 2 }}
          >
            {customer.homePageData?.dealCategories?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.2,
              fontWeight: "bold",
              borderRadius: 2,
              background: "linear-gradient(45deg, #00b09b, #96c93d)",
            }}
          >
            💾 Save Changes
          </Button>

          <Button
            onClick={onClose}
            variant="outlined"
            fullWidth
            sx={{
              py: 1.2,
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default EditDealForm;