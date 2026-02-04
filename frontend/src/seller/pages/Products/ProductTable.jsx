import * as React from "react";
import {
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  fetchSellerProducts,
  deleteProduct,
} from "../../../State/seller/sellerProductSlice";
import EditProductDialog from "./EditProductDialog"; // ✅ new dialog component

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function ProductTable() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store.sellerProduct);
  const jwt = localStorage.getItem("jwt");

  // modal state
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  React.useEffect(() => {
    if (jwt) dispatch(fetchSellerProducts(jwt));
  }, [dispatch, jwt]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setOpenEdit(true);
  };

  const handleDelete = (id) => {
    if (jwt) dispatch(deleteProduct({ productId: id, jwt }));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Images</StyledTableCell>
              <StyledTableCell align="right">Title</StyledTableCell>
              <StyledTableCell align="right">MRP</StyledTableCell>
              <StyledTableCell align="right">Selling Price</StyledTableCell>
              <StyledTableCell align="right">Color</StyledTableCell>
              <StyledTableCell align="right">Stock</StyledTableCell>
              <StyledTableCell align="right">Edit</StyledTableCell>
              <StyledTableCell align="right">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((item) => (
              <StyledTableRow key={item.id}>
                {/* Images */}
                <StyledTableCell>
                  <div className="flex gap-1 flex-wrap">
                    {item.images?.map((image, idx) => (
                      <img
                        key={idx}
                        className="w-20 h-20 rounded-md object-cover"
                        alt=""
                        src={image}
                      />
                    ))}
                  </div>
                </StyledTableCell>

                {/* Product Info */}
                <StyledTableCell align="right">{item.title}</StyledTableCell>
                <StyledTableCell align="right">{item.mrpPrice}</StyledTableCell>
                <StyledTableCell align="right">{item.sellingPrice}</StyledTableCell>
                <StyledTableCell align="right">{item.color}</StyledTableCell>
                <StyledTableCell align="right">
                  <Button size="small" variant="outlined" color="success">
                    {item.quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK"}
                  </Button>
                </StyledTableCell>

                {/* Actions */}
                <StyledTableCell align="right">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit />
                  </IconButton>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ New Edit Dialog */}
      {selectedProduct && (
        <EditProductDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          product={selectedProduct}
        />
      )}
    </>
  );
}
