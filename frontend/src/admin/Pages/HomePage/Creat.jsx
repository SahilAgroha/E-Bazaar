import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
import { useAppDispatch } from "../../../State/Store";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary"; 
import { createHomeCategory } from "../../../State/admin/HomeCategorySlice"; 

const CreateHomeCategory = () => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    name: "",
    image: "",
    categoryId: "",
    section: "GRID", // default
  });
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const url = await uploadToCloudinary(file);
      setForm({ ...form, image: url });
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting category", form);
    dispatch(createHomeCategory(form));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="space-y-6 p-6 border rounded-md"
    >
      <Typography variant="h5" className="text-center">
        Create Home Category
      </Typography>

      <TextField
        fullWidth
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <TextField
        fullWidth
        label="Category Id"
        value={form.categoryId}
        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
      />

      <FormControl fullWidth>
        <InputLabel>Section</InputLabel>
        <Select
          value={form.section}
          label="Section"
          onChange={(e) => setForm({ ...form, section: e.target.value })}
        >
          <MenuItem value="GRID">Grid</MenuItem>
          <MenuItem value="SHOP_BY_CATEGORIES">Shop By Categories</MenuItem>
          <MenuItem value="ELECTRIC_CATEGORIES">Electronic Categories</MenuItem>
          <MenuItem value="DEALS">Deals</MenuItem>
        </Select>
      </FormControl>

      <Button variant="outlined" component="label">
        Upload Image
        <input type="file" hidden onChange={handleImageUpload} />
      </Button>
      {loading ? (
        <p>Uploading...</p>
      ) : (
        form.image && <img src={form.image} alt="preview" className="w-32 mt-2" />
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ py: ".9rem" }}
        disabled={loading}
      >
        Create Category
      </Button>
    </Box>
  );
};

export default CreateHomeCategory;
