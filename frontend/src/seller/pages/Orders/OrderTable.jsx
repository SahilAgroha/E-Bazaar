import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Typography, Box, Chip, Avatar } from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../../State/Store'
import { fetchSellerOrders, updateOrderStatus } from '../../../State/seller/sellerOrderSlice';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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
  '&:hover': {
    backgroundColor: '#f8fafc',
  },
  transition: 'background-color 0.2s ease',
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Premium semantic colors for statuses
const orderStatusColor = {
  PENDING: { color: "#d97706", bg: "#fef3c7", label: "PENDING" },
  CONFIRMED: { color: "#0284c7", bg: "#e0f2fe", label: "CONFIRMED" },
  PLACED: { color: "#2563eb", bg: "#dbeafe", label: "PLACED" },
  SHIPPED: { color: "#7c3aed", bg: "#ede9fe", label: "SHIPPED" },
  DELIVERED: { color: "#16a34a", bg: "#dcfce7", label: "DELIVERED" },
  CANCELED: { color: "#dc2626", bg: "#fee2e2", label: "CANCELED" }, 
};

const orderStatusOptions = Object.values(orderStatusColor);


export default function OrderTable() {
  const dispatch=useAppDispatch();
  const {sellerOrder}=useAppSelector(store=>store);

  React.useEffect(()=>{
    dispatch(fetchSellerOrders(localStorage.getItem('jwt') || ''));
  },[])

  const [anchorEL,setAnchorEL]=React.useState({})
  const open =Boolean(anchorEL);
  const handleClick=(event,orderId)=>{
    setAnchorEL((prev)=>({...prev,[orderId]:event.currentTarget}));
  };
  const handleClose=(orderId)=>()=>{
    setAnchorEL((prev)=>({...prev,[orderId]:null}));
  };
  const handleUpdateOrderStatus=(orderId,orderStatus)=>()=>{
    dispatch(updateOrderStatus({jwt:localStorage.getItem('jwt') || "",orderId,orderStatus}));
    handleClose(orderId)();
  }


  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, letterSpacing: '-0.025em' }}>
          All Orders
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
          Manage your customer orders, track shipping, and update statuses.
        </Typography>
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
        <Table sx={{ minWidth: 900 }} aria-label="premium orders table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>Products</StyledTableCell>
              <StyledTableCell>Shipping Address</StyledTableCell>
              <StyledTableCell align="center">Order Status</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellerOrder.orders.map((item) => (
              <StyledTableRow key={item.id}>
                {/* Order ID */}
                <StyledTableCell component="th" scope="row">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b', fontFamily: 'monospace', fontSize: '1rem' }}>
                    #{item.id}
                  </Typography>
                </StyledTableCell>

                {/* Products */}
                <StyledTableCell>
                  <div className="flex flex-col gap-4">
                    {item.orderItems.map((orderItem, idx)=> (
                      <div key={idx} className='flex items-center gap-4'>
                        <Avatar 
                          src={orderItem.product.images[0]} 
                          variant="rounded"
                          sx={{ width: 64, height: 64, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} 
                        />
                        <div className="flex flex-col">
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {orderItem.product.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            ₹{orderItem.product.sellingPrice} • {orderItem.product.color}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </StyledTableCell>

                {/* Shipping Address */}
                <StyledTableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#334155' }}>
                      {item.shippingAddress.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                      {item.shippingAddress.address}, {item.shippingAddress.city}<br/>
                      {item.shippingAddress.state} - <span style={{ fontWeight: 700 }}>{item.shippingAddress.pinCode}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                      <span style={{ fontWeight: 600 }}>Mobile:</span> {item.shippingAddress.mobile}
                    </Typography>
                  </Box>
                </StyledTableCell>

                {/* Order Status */}
                <StyledTableCell align="center">
                  {(() => {
                    const statusConfig = orderStatusColor[item.orderStatus] || { color: "#64748b", bg: "#f1f5f9", label: item.orderStatus };
                    return (
                      <Chip 
                        label={statusConfig.label} 
                        sx={{ 
                          bgcolor: statusConfig.bg, 
                          color: statusConfig.color,
                          fontWeight: 800,
                          letterSpacing: 1,
                          borderRadius: 2,
                          px: 1
                        }} 
                        size="small"
                      />
                    );
                  })()}
                </StyledTableCell>

                {/* Actions */}
                <StyledTableCell align="center">
                    <Button 
                      size='small' 
                      variant="outlined" 
                      endIcon={<KeyboardArrowDownIcon />}
                      onClick={(e)=>handleClick(e, item.id)}
                      sx={{
                        borderColor: '#cbd5e1',
                        color: '#475569',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' }
                      }}
                    >
                      Update
                    </Button>
                    <Menu 
                      id={`status-menu-${item.id}`} 
                      anchorEl={anchorEL[item.id]} 
                      open={Boolean(anchorEL[item.id])} 
                      onClose={handleClose(item.id)}
                      MenuListProps={{'aria-labelledby':`status-menu-${item.id}`}}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          overflow: 'visible',
                          filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))',
                          mt: 1.5,
                          borderRadius: 2,
                          border: '1px solid #e2e8f0',
                          minWidth: 140,
                        },
                      }}
                    >
                      {orderStatusOptions.map((status)=>(
                        <MenuItem 
                          key={status.label} 
                          onClick={handleUpdateOrderStatus(item.id, status.label)}
                          sx={{ fontSize: 14, fontWeight: 500, color: '#475569' }}
                        >
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: status.color, mr: 1.5 }} />
                          {status.label}
                        </MenuItem>
                      ))}
                    </Menu>
                </StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
