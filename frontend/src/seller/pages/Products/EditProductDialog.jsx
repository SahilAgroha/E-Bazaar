import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  CircularProgress,
  Typography,
  Box,
  Divider
} from "@mui/material";
import { AddPhotoAlternate, Close, WarningAmber } from "@mui/icons-material";
import { useFormik } from "formik";
import { useState } from "react";
import { uploadToCloudinary } from "../../../Util/UploadToCloudinary";
import { colors } from "../../../data/Filter/color";
import { sizes } from "../../../data/Filter/sizes";
import { mainCategory } from "../../../data/category/mainCategory";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { updateProduct, fetchSellerProducts } from "../../../State/seller/sellerProductSlice";

// Shared Premium UI for text fields
const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#fafaf9',
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: '#d1d5db' },
    '&.Mui-focused fieldset': { borderColor: '#00927c', borderWidth: '2px' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#00927c' },
};

const getCategoryId = (cat) => {
  if (!cat) return "";
  return typeof cat === "object" ? (cat.categoryId || cat.name || "") : cat;
};

const getCategoryHierarchy = (categoryId) => {
  if (!categoryId) return { category: "", category2: "", category3: "" };
  
  for (const main of mainCategory) {
    if (main.categoryId === categoryId) {
      return { category: main.categoryId, category2: "", category3: "" };
    }
    for (const sub of main.levelTwoCategory || []) {
      if (sub.categoryId === categoryId) {
        return { category: main.categoryId, category2: sub.categoryId, category3: "" };
      }
      for (const leaf of sub.levelThreeCategory || []) {
        if (leaf.categoryId === categoryId) {
          return { category: main.categoryId, category2: sub.categoryId, category3: leaf.categoryId };
        }
      }
    }
  }
  
  // Custom fallback splitting by `_` just in case it's not found in the mainCategory array
  const parts = categoryId.split('_');
  if (parts.length >= 3) {
    return { 
      category: parts[0], 
      category2: `${parts[0]}_${parts[1]}`, 
      category3: categoryId 
    };
  }
  return { category: categoryId, category2: "", category3: "" };
};

const EditProductDialog = ({ open, onClose, product }) => {
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt");
  const { loading } = useAppSelector((state) => state.sellerProduct);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false); // Controls unsaved changes prompt

  const resolvedCategories = getCategoryHierarchy(product?.category?.categoryId);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      mrpPrice: product?.mrpPrice || "",
      sellingPrice: product?.sellingPrice || "",
      quantity: product?.quantity || "",
      color: product?.color || "",
      images: product?.images || [],
      category: resolvedCategories.category,
      category2: resolvedCategories.category2,
      category3: resolvedCategories.category3,
      sizes: product?.sizes || "",
    },
    onSubmit: async (values) => {
      try {
        if (jwt && product) {
          // The backend updateProduct uses the Product entity which doesn't
          // support category2, category3 natively, resolving to 400 bad request.
          // Since categories aren't editable in the backend update anyway, we omit them.
          const { category, category2, category3, ...updatePayload } = values;

          await dispatch(
            updateProduct({
              productId: product.id,
              product: updatePayload,
              jwt,
            })
          );
          dispatch(fetchSellerProducts(jwt));
          setConfirmDialog(false);
          onClose(); // finally close the edit dialog
        }
      } catch (err) {
        console.error("Update error", err);
      }
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const image = await uploadToCloudinary(file);
      formik.setFieldValue("images", [...formik.values.images, image]);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updated = [...formik.values.images];
    updated.splice(index, 1);
    formik.setFieldValue("images", updated);
  };

  // Safe closing mechanism: Check for unsaved edits first
  const handleRequestClose = (event, reason) => {
    // Stricter check: Deep equality to ensure there are true changes before nagging
    const hasTrueChanges = JSON.stringify(formik.initialValues) !== JSON.stringify(formik.values);
    
    if (hasTrueChanges) {
      setConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    formik.resetForm();
    setConfirmDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleRequestClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: { 
            borderRadius: 4, 
            boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ p: 4, pb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
            Edit Product
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Update your product's details, pricing, and inventory specifications.
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ p: 4, pt: 1 }}>
            <Grid container spacing={3}>
              {/* Image Upload */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    type="file"
                    id="fileInputEdit"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <label className="relative" htmlFor="fileInputEdit">
                    <Box sx={{ 
                      width: 90, height: 90, cursor: 'pointer', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', 
                      border: '2px dashed #cbd5e1', borderRadius: 3,
                      bgcolor: '#f8fafc', '&:hover': { borderColor: '#94a3b8', bgcolor: '#f1f5f9' },
                      transition: 'all 0.2s'
                    }}>
                      <AddPhotoAlternate sx={{ color: '#64748b', fontSize: 32 }} />
                    </Box>
                    {uploadingImage && (
                      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress size={24} sx={{ color: '#00927c' }} />
                      </Box>
                    )}
                  </label>
                  
                  {formik.values.images.map((image, index) => (
                    <Box key={index} sx={{ position: 'relative', width: 90, height: 90, borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      <img
                        className="w-full h-full object-cover"
                        src={image}
                        alt={`EditImage ${index + 1}`}
                      />
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        size="small"
                        sx={{ 
                          position: "absolute", top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.9)', 
                          color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' }, p: 0.5
                        }}
                      >
                        <Close sx={{ fontSize: "1rem" }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* Title */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="title"
                  label="Product Title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  sx={textFieldSx}
                />
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  multiline rows={4}
                  fullWidth
                  id="description"
                  label="Detailed Description"        
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  sx={textFieldSx}
                />
              </Grid>

              {/* Prices */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  id="mrpPrice"
                  label="MRP Price (₹)"
                  value={formik.values.mrpPrice}
                  onChange={formik.handleChange}
                  sx={textFieldSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  id="sellingPrice"
                  label="Selling Price (₹)"
                  value={formik.values.sellingPrice}
                  onChange={formik.handleChange}
                  sx={textFieldSx}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField 
                  name='quantity' type='number'
                  fullWidth id='quantity' label='Stock Quantity' 
                  value={formik.values.quantity} onChange={formik.handleChange}
                  sx={textFieldSx}
                />
               </Grid>

              {/* Color */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth sx={textFieldSx}>
                  <InputLabel id="color-label">Color</InputLabel>
                  <Select
                    labelId="color-label"
                    id="color"
                    name="color"
                    value={formik.values.color}
                    onChange={formik.handleChange}
                    label="Color"
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {colors.map((color) => (
                      <MenuItem key={color.name} value={color.name}>
                        <div className="flex items-center gap-3">
                          <span
                            style={{ backgroundColor: color.hex }}
                            className={`h-4 w-4 rounded-full ${color.name === "White" ? "border border-gray-300" : "shadow-sm"}`}
                          ></span>
                          <Typography sx={{ fontSize: 14 }}>{color.name}</Typography>
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Category 1 */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth sx={textFieldSx}>
                  <InputLabel id="category-label">Primary Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formik.values.category}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue("category2", "");
                      formik.setFieldValue("category3", "");
                    }}
                    label="Primary Category"
                  >
                    {mainCategory.map((item) => (
                      <MenuItem key={item.categoryId} value={item.categoryId}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Category 2 */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth sx={textFieldSx} disabled={!formik.values.category}>
                  <InputLabel id="category2-label">Sub Category</InputLabel>
                  <Select
                    labelId="category2-label"
                    id="category2"
                    name="category2"
                    value={formik.values.category2}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue("category3", "");
                    }}
                    label="Sub Category"
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {mainCategory
                      .find((cat) => cat.categoryId === formik.values.category)
                      ?.levelTwoCategory?.map((sub) => (
                        <MenuItem key={sub.categoryId} value={sub.categoryId}>
                          {sub.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Category 3 */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth sx={textFieldSx} disabled={!formik.values.category2}>
                  <InputLabel id="category3-label">Final Category</InputLabel>
                  <Select
                    labelId="category3-label"
                    id="category3"
                    name="category3"
                    value={formik.values.category3}
                    onChange={formik.handleChange}
                    label="Final Category"
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {mainCategory
                      .flatMap((cat) => cat.levelTwoCategory || [])
                      .find(
                        (sub) => sub.categoryId === formik.values.category2
                      )
                      ?.levelThreeCategory?.map((third) => (
                        <MenuItem key={third.categoryId} value={third.categoryId}>
                          {third.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Sizes */}
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth sx={textFieldSx}>
                  <InputLabel id="sizes-label">Sizes</InputLabel>
                  <Select
                    labelId="sizes-label"
                    id="sizes"
                    name="sizes"
                    value={formik.values.sizes}
                    onChange={formik.handleChange}
                    label="Sizes"
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {sizes.map((size) => (
                      <MenuItem key={size.name} value={size.name}>
                        {size.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <Divider sx={{ borderColor: '#e2e8f0' }} />
          
          <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
            <Button 
              onClick={handleRequestClose}
              sx={{ color: '#64748b', fontWeight: 600, '&:hover': { bgcolor: '#f1f5f9' }, px: 3, py: 1, borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                bgcolor: '#00927c', 
                color: 'white', 
                fontWeight: 600,
                boxShadow: 'none',
                px: 4, py: 1, 
                borderRadius: 2,
                '&:hover': { bgcolor: '#007a68', boxShadow: '0 4px 6px -1px rgb(0 146 124 / 0.4)' },
                '&.Mui-disabled': { bgcolor: '#ccfbf1', color: '#14b8a6' }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Update Product"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Unsaved Changes Confirmation Dialog */}
      <Dialog 
        open={confirmDialog} 
        onClose={() => setConfirmDialog(false)}
        PaperProps={{
          elevation: 0,
          sx: { borderRadius: 3, boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1, color: '#0f172a', fontWeight: 700 }}>
          <WarningAmber sx={{ color: '#f59e0b', fontSize: 28 }} />
          Unsaved Changes
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Typography sx={{ color: '#475569' }}>
            You have unsaved changes. Do you want to save them before you leave?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setConfirmDialog(false)} 
            sx={{ color: '#64748b', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDiscard} 
            sx={{ color: '#ef4444', fontWeight: 600, '&:hover': { bgcolor: '#fef2f2' } }}
          >
            Don't Save
          </Button>
          <Button 
            onClick={formik.handleSubmit} 
            variant="contained"
            sx={{ bgcolor: '#00927c', boxShadow: 'none', fontWeight: 600, '&:hover': { bgcolor: '#007a68', boxShadow: 'none' } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditProductDialog;
