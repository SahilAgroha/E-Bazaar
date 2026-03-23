import { Grid, TextField } from "@mui/material";

const BecomeSellerFormStep2 = ({ formik }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="pickupAddress.name"
          label="Name"
          value={formik.values.pickupAddress.name}
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          name="pickupAddress.mobile"
          label="Mobile"
          value={formik.values.pickupAddress.mobile}
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          name="pickupAddress.pinCode"
          label="Pin Code"
          value={formik.values.pickupAddress.pinCode}
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          name="pickupAddress.address"
          label="Address"
          value={formik.values.pickupAddress.address}
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          name="pickupAddress.locality"
          label="Locality"
          value={formik.values.pickupAddress.locality}
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          name="pickupAddress.city"
          label="City"
          value={formik.values.pickupAddress.city}
          onChange={formik.handleChange}
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          fullWidth
          name="pickupAddress.state"
          label="State"
          value={formik.values.pickupAddress.state}
          onChange={formik.handleChange}
        />
      </Grid>
    </Grid>
  );
};

export default BecomeSellerFormStep2;