import { useEffect, useState } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton, Select, MenuItem, FormControl, InputLabel, styled, Paper, TableContainer
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchAllSellers, updateSellerStatus, deleteSeller } from "../../../State/seller/sellerSlice";
import { AccountStatus } from "../../../types/SellerTypes";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    cursor: 'pointer',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const SellerTable = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sellers, loading, error } = useAppSelector((store) => store.seller);
  const jwt = localStorage.getItem('jwt');
  const [filterStatus, setFilterStatus] = useState("ACTIVE");

  useEffect(() => {
    dispatch(fetchAllSellers({ status: filterStatus, jwt }));
  }, [dispatch, jwt, filterStatus]);

  const handleStatusUpdate = (id, status) => {
    dispatch(updateSellerStatus({ id, status, jwt }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this seller?')) {
      dispatch(deleteSeller(id));
    }
  };

  const handleRowClick = (id) => {
    navigate(`/admin/sellers/${id}`);
  };

  if (loading) return <p>Loading sellers...</p>;
  // if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="status-filter-label">Filter by Status</InputLabel>
        <Select
          labelId="status-filter-label"
          value={filterStatus}
          label="Filter by Status"
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {Object.values(AccountStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {status.replace(/_/g, " ")}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="seller table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellers.map((seller) => (
              <StyledTableRow key={seller.id} onClick={() => handleRowClick(seller.id)}>
                <TableCell>{seller.id}</TableCell>
                <TableCell>{seller.sellerName}</TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={seller.accountStatus}
                    onChange={(e) => handleStatusUpdate(seller.id, e.target.value)}
                    sx={{ width: '100%' }}
                  >
                    {Object.values(AccountStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.replace(/_/g, " ")}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <IconButton onClick={() => handleDelete(seller.id)}>
                    <Delete sx={{ color: "red" }} />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SellerTable;
