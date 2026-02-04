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
} from "@mui/material";
import { AddPhotoAlternate, Close } from "@mui/icons-material";
import { useFormik } from "formik";
import { useState } from "react";
import { uploadToCloudinary } from "../../../Util/UploadToCloudinary";
import { colors } from "../../../data/Filter/color";
import { sizes } from "../../../data/Filter/sizes";
import { mainCategory } from "../../../data/category/mainCategory";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { updateProduct, fetchSellerProducts } from "../../../State/seller/sellerProductSlice";

const EditProductDialog = ({ open, onClose, product }) => {
  const dispatch = useAppDispatch();
  const jwt = localStorage.getItem("jwt");
  const { loading } = useAppSelector((state) => state.sellerProduct);

  const [uploadingImage, setUploadingImage] = useState(false);

  const formik = useFormik({
    enableReinitialize: true, // ✅ important for pre-filling
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      mrpPrice: product?.mrpPrice || "",
      sellingPrice: product?.sellingPrice || "",
      quantity: product?.quantity || "",
      color: product?.color || "",
      images: product?.images || [],
      category: product?.category || "",
      category2: product?.category2 || "",
      category3: product?.category3 || "",
      sizes: product?.sizes || "",
    },
    onSubmit: async (values) => {
      try {
        if (jwt && product) {
          await dispatch(
            updateProduct({
              productId: product.id,
              product: values,
              jwt,
            })
          );
          dispatch(fetchSellerProducts(jwt));
          onClose();
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Image Upload */}
            <Grid className="flex flex-wrap gap-5" item xs={12}>
              <input
                type="file"
                id="fileInputEdit"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label className="relative" htmlFor="fileInputEdit">
                <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
                  <AddPhotoAlternate className="text-gray-700" />
                </span>
                {uploadingImage && (
                  <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                    <CircularProgress />
                  </div>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {formik.values.images.map((image, index) => (
                  <div className="relative" key={index}>
                    <img
                      className="w-24 h-24 object-cover"
                      src={image}
                      alt={`EditImage ${index + 1}`}
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      size="small"
                      color="error"
                      sx={{ position: "absolute", top: 0, right: 0 }}
                    >
                      <Close sx={{ fontSize: "1rem" }} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </Grid>

            {/* Title */}
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                id="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Description */}
            <Grid size={{xs:12}}>
              <TextField
                fmultiline rows={4}
                fullWidth
                id="description"
                label="Description"        
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Prices */}
            <Grid size={{xs:12,md:6,lg:3}}>
              <TextField
                fullWidth
                type="number"
                id="mrpPrice"
                label="MRP Price"
                value={formik.values.mrpPrice}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid size={{xs:12,md:6,lg:3}}>
              <TextField
                fullWidth
                type="number"
                id="sellingPrice"
                label="Selling Price"
                value={formik.values.sellingPrice}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item size={{xs:12,md:4,lg:3}}>
              <TextField name='quantity' type='number'
                fullWidth id='quantity' label='Quantity' value={formik.values.quantity} onChange={formik.handleChange}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)} helperText={formik.touched.quantity && formik.errors.quantity} required />
             </Grid>

            {/* Color */}
            <Grid size={{xs:12,md:4,lg:3}}>
              <FormControl fullWidth>
                <InputLabel id="color-label">Color</InputLabel>
                <Select
                  labelId="color-label"
                  id="color"
                  name="color"
                  value={formik.values.color}
                  onChange={formik.handleChange}
                >
                  {colors.map((color) => (
                    <MenuItem key={color.name} value={color.name}>
                      <div className="flex gap-3">
                        <span
                          style={{ backgroundColor: color.hex }}
                          className={`h-5 w-5 rounded-full ${
                            color.name === "White" ? "border" : ""
                          }`}
                        ></span>
                        <p>{color.name}</p>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sizes */}
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="sizes-label">Sizes</InputLabel>
                <Select
                  labelId="sizes-label"
                  id="sizes"
                  name="sizes"
                  value={formik.values.sizes}
                  onChange={formik.handleChange}
                >
                  {sizes.map((size) => (
                    <MenuItem key={size.name} value={size.name}>
                      {size.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Category 1 */}
            <Grid size={{xs:12,md:4,lg:4}}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
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
            <Grid size={{xs:12,md:4,lg:4}}>
              <FormControl fullWidth>
                <InputLabel id="category2-label">Second Category</InputLabel>
                <Select
                  labelId="category2-label"
                  id="category2"
                  name="category2"
                  value={formik.values.category2}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue("category3", "");
                  }}
                  disabled={!formik.values.category}
                >
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
            <Grid size={{xs:12,md:4,lg:4}}>
              <FormControl fullWidth>
                <InputLabel id="category3-label">Third Category</InputLabel>
                <Select
                  labelId="category3-label"
                  id="category3"
                  name="category3"
                  value={formik.values.category3}
                  onChange={formik.handleChange}
                  disabled={!formik.values.category2}
                >
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
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Update Product"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProductDialog;
