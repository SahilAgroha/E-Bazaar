import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { AddPhotoAlternate } from "@mui/icons-material";
import { useAppDispatch } from "../../../State/Store";
import { updateSeller } from "../../../State/seller/sellerSlice";
import { uploadToCloudinary } from "../../../Util/UploadToCloudinary";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function EditSellerDialog({ open, onClose, seller }) {
  const dispatch = useAppDispatch();

  // deep copy seller so we can edit safely
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(seller)));
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState(0);

  const handleChange = (path, value) => {
    setForm((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = updated;
      while (keys.length > 1) {
        const key = keys.shift();
        obj[key] = obj[key] || {};
        obj = obj[key];
      }
      obj[keys[0]] = value;
      return updated;
    });
  };

  const handleImageUpload = async (field, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      handleChange(field, url);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting form:", form);
    dispatch(updateSeller({ jwt: localStorage.getItem("jwt"), seller: form }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Seller Profile</DialogTitle>

      <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth">
        <Tab label="Basic Info" />
        <Tab label="Business" />
        <Tab label="Bank" />
        <Tab label="Pickup Address" />
      </Tabs>

      <DialogContent dividers>
        {/* ========== Basic Info ========== */}
        <TabPanel value={tab} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Seller Name"
                value={form.sellerName || ""}
                onChange={(e) => handleChange("sellerName", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                value={form.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Mobile"
                value={form.mobile || ""}
                onChange={(e) => handleChange("mobile", e.target.value)}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* ========== Business Details ========== */}
        <TabPanel value={tab} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Business Name"
                value={form.businessDetails?.businessName || ""}
                onChange={(e) =>
                  handleChange("businessDetails.businessName", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Business Email"
                value={form.businessDetails?.businessEmail || ""}
                onChange={(e) =>
                  handleChange("businessDetails.businessEmail", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Business Mobile"
                value={form.businessDetails?.businessMobile || ""}
                onChange={(e) =>
                  handleChange("businessDetails.businessMobile", e.target.value)
                }
              />
            </Grid>

            {/* Logo Upload */}
            <Grid item xs={6}>
              <Avatar src={form.businessDetails?.logo} sx={{ width: 80, height: 80 }} />
              <IconButton component="label" disabled={uploading}>
                <AddPhotoAlternate />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload("businessDetails.logo", e.target.files[0])
                  }
                />
              </IconButton>
            </Grid>

            {/* Banner Upload */}
            <Grid item xs={12}>
              {form.businessDetails?.banner && (
                <img
                  src={form.businessDetails?.banner}
                  alt="banner"
                  style={{ width: "100%", maxHeight: 150, objectFit: "cover" }}
                />
              )}
              <Button
                component="label"
                variant="outlined"
                disabled={uploading}
                sx={{ mt: 1 }}
              >
                Upload Banner
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload("businessDetails.banner", e.target.files[0])
                  }
                />
              </Button>
            </Grid>
          </Grid>
        </TabPanel>

        {/* ========== Bank Details ========== */}
        <TabPanel value={tab} index={2}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Account No"
                value={form.bankDetails?.accountNumber || ""}
                onChange={(e) =>
                  handleChange("bankDetails.accountNumber", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Holder Name"
                value={form.bankDetails?.accountHolderName || ""}
                onChange={(e) =>
                  handleChange("bankDetails.accountHolderName", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="IFSC Code"
                value={form.bankDetails?.ifscCode || ""}
                onChange={(e) => handleChange("bankDetails.ifscCode", e.target.value)}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* ========== Pickup Address ========== */}
        <TabPanel value={tab} index={3}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Name"
                value={form.pickupAddress?.name || ""}
                onChange={(e) => handleChange("pickupAddress.name", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Locality"
                value={form.pickupAddress?.locality || ""}
                onChange={(e) =>
                  handleChange("pickupAddress.locality", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Address"
                value={form.pickupAddress?.address || ""}
                onChange={(e) =>
                  handleChange("pickupAddress.address", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="City"
                value={form.pickupAddress?.city || ""}
                onChange={(e) => handleChange("pickupAddress.city", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="State"
                value={form.pickupAddress?.state || ""}
                onChange={(e) => handleChange("pickupAddress.state", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Pincode"
                value={form.pickupAddress?.pinCode || ""}
                onChange={(e) => handleChange("pickupAddress.pinCode", e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Mobile"
                value={form.pickupAddress?.mobile || ""}
                onChange={(e) => handleChange("pickupAddress.mobile", e.target.value)}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
