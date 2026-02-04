import React, { useEffect, useState } from "react";
import { Button, TextField, Select, MenuItem, Paper } from "@mui/material";
import axios from "axios";
import { uploadToCloudinary } from "../../../Util/UploadToCloudinary";

const API_URL = "http://localhost:8080/admin/home/categories";

const AdminHomeCategoryPanel = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    categoryId: "",
    section: "GRID",
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/home-category", {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = [
        {
          name: newCategory.name,
          categoryId: newCategory.categoryId,
          section: newCategory.section,
          image: imageUrl,
        },
      ];

      await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });

      setNewCategory({ name: "", categoryId: "", section: "GRID" });
      setImageFile(null);
      fetchCategories();
    } catch (err) {
      console.error("Error adding category", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin - Home Page Categories</h2>

      {/* Add Form */}
      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <TextField
          label="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          style={{ marginRight: "10px" }}
        />

        <TextField
          label="Linked Category ID"
          value={newCategory.categoryId}
          onChange={(e) => setNewCategory({ ...newCategory, categoryId: e.target.value })}
          style={{ marginRight: "10px" }}
        />

        <Select
  value={newCategory.section}
  onChange={(e) => setNewCategory({ ...newCategory, section: e.target.value })}
  style={{ marginRight: "10px", minWidth: "120px" }}
>
  <MenuItem value="GRID">Grid</MenuItem>
  <MenuItem value="SHOP_BY_CATEGORIES">Shop By</MenuItem>
  <MenuItem value="ELECTRIC_CATEGORIES">Electric</MenuItem>
  <MenuItem value="DEALS">Deals</MenuItem>
</Select>


        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />

        <Button variant="contained" onClick={addCategory} style={{ marginLeft: "10px" }}>
          Add Category
        </Button>
      </Paper>

      {/* Show Saved Categories */}
      <div>
        {categories.map((cat) => (
          <Paper key={cat.id} style={{ margin: "10px", padding: "10px" }}>
            <h4>{cat.name} ({cat.section})</h4>
            {cat.image && <img src={cat.image} alt={cat.name} width="100" />}
            <p>CategoryId: {cat.categoryId}</p>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default AdminHomeCategoryPanel;
