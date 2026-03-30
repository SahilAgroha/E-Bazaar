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
  Typography,
  Box,
  Chip,
  Avatar
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import {
  fetchSellerProducts,
  deleteProduct,
} from "../../../State/seller/sellerProductSlice";
import EditProductDialog from "./EditProductDialog"; // ✅ new dialog component

// Premium Styled components mirroring OrderTable
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: '#1e293b',
    padding: '24px',
    borderBottom: '1px solid #f1f5f9',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#f8fafc",
  },
  transition: "background-color 0.2s ease",
  "&:last-child td, &:last-child th": {
    border: 0,
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
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: '-0.025em' }}>
            All Products
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
            Manage your inventory, update pricing, and add new products.
          </Typography>
        </Box>
      </Box>

      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
        }}
      >
        <Table sx={{ minWidth: 900 }} aria-label="premium products table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Product</StyledTableCell>
              <StyledTableCell align="center">MRP</StyledTableCell>
              <StyledTableCell align="center">Selling Price</StyledTableCell>
              <StyledTableCell align="center">Color</StyledTableCell>
              <StyledTableCell align="center">Stock</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((item) => (
              <StyledTableRow key={item.id}>
                {/* Image + Title */}
                <StyledTableCell>
                  <div className="flex items-center gap-4">
                    {item.images?.[0] ? (
                       <Avatar 
                        src={item.images[0]} 
                        variant="rounded"
                        sx={{ width: 64, height: 64, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} 
                      />
                    ) : (
                      <Box sx={{ width: 64, height: 64, bgcolor: '#f1f5f9', borderRadius: 2 }} />
                    )}
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {item.title}
                    </Typography>
                  </div>
                </StyledTableCell>

                {/* MRP */}
                <StyledTableCell align="center">
                  <Typography variant="body2" sx={{ color: '#94a3b8', textDecoration: 'line-through', fontWeight: 500 }}>
                    ₹{item.mrpPrice}
                  </Typography>
                </StyledTableCell>

                {/* Selling Price */}
                <StyledTableCell align="center">
                  <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 800 }}>
                    ₹{item.sellingPrice}
                  </Typography>
                </StyledTableCell>

                {/* Color */}
                <StyledTableCell align="center">
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>
                    {item.color}
                  </Typography>
                </StyledTableCell>

                {/* Stock Status */}
                <StyledTableCell align="center">
                  <Chip 
                    label={item.quantity > 0 ? "IN STOCK" : "OUT OF STOCK"} 
                    sx={{ 
                      bgcolor: item.quantity > 0 ? '#ecfdf5' : '#fef2f2', 
                      color: item.quantity > 0 ? '#10b981' : '#ef4444',
                      fontWeight: 800,
                      letterSpacing: 1,
                      borderRadius: 2,
                      px: 1,
                      fontSize: '0.75rem'
                    }} 
                    size="small"
                  />
                </StyledTableCell>

                {/* Actions */}
                <StyledTableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(item)}
                      sx={{ 
                        color: '#3b82f6', 
                        bgcolor: '#eff6ff', 
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#dbeafe' } 
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(item.id)}
                      sx={{ 
                        color: '#ef4444', 
                        bgcolor: '#fef2f2', 
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#fee2e2' } 
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
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
    </Box>
  );
}
