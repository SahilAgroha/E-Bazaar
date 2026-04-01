import { Box, TextField } from "@mui/material";

const BecomeSellerFormStep1 = ({ formik }) => {
  return (
    <div className="flex flex-col gap-5">
      <TextField
        fullWidth
        name="mobile"
        label="Mobile"
        value={formik.values.mobile}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
        helperText={formik.touched.mobile && formik.errors.mobile}
      />

      <TextField
        fullWidth
        name="gstin"
        label="GSTIN"
        value={formik.values.gstin}
        onChange={formik.handleChange}
      />
    </div>
  );
};

export default BecomeSellerFormStep1;