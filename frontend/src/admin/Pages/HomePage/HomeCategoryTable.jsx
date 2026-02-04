import React, { useState, useEffect, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Box, CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { Edit, Delete } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../State/Store";
import { deleteHomeCategory, updateHomeCategory, fetchHomePageData } from "../../../State/customer/customerSlice";
import { uploadToCloudinary } from "../../../Util/UploadToCloudinary";
import { mainCategory } from "../../../data/category/mainCategory";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
  "&:last-child td, &:last-child th": { border: 0 },
}));

export default function HomeCategoryTable({ data }) {
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt") || undefined;

  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);

  // flatten categories for dropdown
  const allCategories = useMemo(() => {
    const flat = [];
    const flatten = (list) => {
      list.forEach((item) => {
        flat.push({ name: item.name, id: item.categoryId });
        if (item.levelTwoCategory) flatten(item.levelTwoCategory);
        if (item.levelThreeCategory) flatten(item.levelThreeCategory);
      });
    };
    flatten(mainCategory);
    return flat;
  }, []);

  const formik = useFormik({
    initialValues: { name: "", categoryId: "", image: "", section: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      categoryId: Yup.string().required("Required"),
      image: Yup.string().required("Image required"),
    }),
    onSubmit: async (values) => {
      if (!editingCategory) return;

      const homeCategory = { ...editingCategory, ...values };

      await dispatch(updateHomeCategory({ id: editingCategory.id, homeCategory, jwt }));
      await dispatch(fetchHomePageData({ jwt }));

      handleClose();
    },
  });

  useEffect(() => {
    if (editingCategory) {
      formik.setValues({
        name: editingCategory.name || "",
        categoryId: editingCategory.categoryId || "",
        image: editingCategory.image || "",
        section: editingCategory.section || "",
      });
    }
  }, [editingCategory]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setUploading(false);
      if (url) formik.setFieldValue("image", url);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    formik.resetForm();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>No</StyledTableCell>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell align="right">Name</StyledTableCell>
              <StyledTableCell align="right">CategoryId</StyledTableCell>
              <StyledTableCell align="right">Section</StyledTableCell>
              <StyledTableCell align="right">Update</StyledTableCell>
              <StyledTableCell align="right">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((category, index) => (
              <StyledTableRow key={category.id}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{category.id}</StyledTableCell>
                <StyledTableCell>
                  <img className="w-20 rounded-md" src={category.image} alt={category.name} />
                </StyledTableCell>
                <StyledTableCell align="right">{category.name}</StyledTableCell>
                <StyledTableCell align="right">{category.categoryId}</StyledTableCell>
                <StyledTableCell align="right">{category.section}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button onClick={() => handleEdit(category)}>
                    <Edit />
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    onClick={() =>
                      category.id &&
                      dispatch(deleteHomeCategory({ id: category.id, jwt }))
                    }
                  >
                    <Delete sx={{ color: "red" }} />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {data.length === 0 && (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="center">
                  No data
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ===== Edit Popup ===== */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Category</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            {/* Name */}
            <TextField
              fullWidth margin="normal" label="Name"
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
              {allCategories.map((opt) => (
                <MenuItem key={opt.id} value={opt.id}>
                  {opt.name} ({opt.id})
                </MenuItem>
              ))}
            </TextField>

            {/* Section (read-only) */}
            <TextField
              fullWidth
              margin="normal"
              label="Section"
              value={formik.values.section}
              InputProps={{ readOnly: true }}
            />

            {/* Image Upload */}
            <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
              <Button variant="outlined" component="label" disabled={uploading}>
                {uploading ? <CircularProgress size={20} /> : "Upload Image"}
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
              {formik.values.image && (
                <img src={formik.values.image} alt="preview" className="h-20 rounded-md" />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
