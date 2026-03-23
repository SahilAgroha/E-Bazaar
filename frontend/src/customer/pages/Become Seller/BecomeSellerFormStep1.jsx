import { Box, TextField } from "@mui/material";

const BecomeSellerFormStep1 = ({ formik }) => {
  return (
    <Box>
      <TextField
        fullWidth
        name="mobile"
        label="Mobile"
        value={formik.values.mobile}
        onChange={formik.handleChange}
      />

      <TextField
        fullWidth
        name="gstin"
        label="GSTIN"
        value={formik.values.gstin}
        onChange={formik.handleChange}
      />
    </Box>
  );
};

export default BecomeSellerFormStep1;