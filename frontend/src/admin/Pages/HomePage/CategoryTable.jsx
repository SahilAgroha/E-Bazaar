import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useAppDispatch } from "../../../State/Store";
import { deleteHomeCategory, fetchHomePageData } from "../../../State/customer/customerSlice";

const CategoryTable = ({ categories, setEditingCategory }) => {
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt");

  const handleDelete = (id) => {
    dispatch(deleteHomeCategory({ id, jwt }))
      .unwrap()
      .then(() => dispatch(fetchHomePageData({ jwt })));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="categories table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Section</TableCell>
            <TableCell>Image</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.section}</TableCell>
              <TableCell>
                <img src={category.image} alt={category.name} className="h-12 w-12 rounded" />
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => setEditingCategory(category)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(category.id)}>
                  <Delete sx={{ color: "red" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CategoryTable;
