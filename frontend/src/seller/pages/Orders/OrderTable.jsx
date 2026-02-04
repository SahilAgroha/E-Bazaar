import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useAppDispatch, useAppSelector} from '../../../State/Store'
import { fetchSellerOrders, updateOrderStatus } from '../../../State/seller/sellerOrderSlice';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const orderStatusColor = {
  PENDING: { color: "#FFA500", label: "PENDING" },
  CONFIRMED: { color: "#17A2B8", label: "CONFIRMED" },
  PLACED: { color: "#007BFF", label: "PLACED" },
  SHIPPED: { color: "#6F42C1", label: "SHIPPED" },
  DELIVERED: { color: "#28A745", label: "DELIVERED" },
  CANCELED: { color: "#DC3545", label: "CANCELED" }, 
}

const orderStatus=[
  { color: "#FFA500", label: "PENDING" },
  { color: "#17A2B8", label: "CONFIRMED" },
  { color: "#007BFF", label: "PLACED" },
  { color: "#6F42C1", label: "SHIPPED" },
  { color: "#28A745", label: "DELIVERED" },
  { color: "#DC3545", label: "CANCELED" },
]


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
  }


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Order ID</StyledTableCell>
            <StyledTableCell>Products</StyledTableCell>
            <StyledTableCell align="right">Shipping Address</StyledTableCell>
            <StyledTableCell align="right">Order Status</StyledTableCell>
            <StyledTableCell align="right">updates</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sellerOrder.orders.map((item) => (
            <StyledTableRow key={item.id}>
              <StyledTableCell component="th" scope="row">
                {item.id}
              </StyledTableCell>
              <StyledTableCell >
                <div className="flex gap-1 flex-wrap">
                  {
                    item.orderItems.map((orderItem)=><div className='flex gap-5'>
                      <img src={orderItem.product.images[0]} alt="" className="w-20 rounded-md" />
                      <div className="flex flex-col justify-between py-2">
                        <h1>Title: {orderItem.product.title}</h1>
                        <h1>Selling Price: {orderItem.product.sellingPrice}</h1>
                        <h1>Color: {orderItem.product.color}</h1>
                      </div>
                    </div>)
                  }
                </div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <div className="flex flex-col gap-y-2">
                  <h1>{item.shippingAddress.name}</h1>
                  <h1>{item.shippingAddress.address},{item.shippingAddress.city}</h1>
                  <h1>{item.shippingAddress.state} - {item.shippingAddress.pinCode}</h1>
                  <h1><strong>Mobile:</strong> {item.shippingAddress.mobile}</h1>
                </div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <span className="px-5 py-2 border rounded-md text-[#00927c] border-[#00927c]">
                  {item.orderStatus}
                </span>
              </StyledTableCell>
              <StyledTableCell align="right">
                  <Button size='small' color='primary' onClick={(e)=>handleClick(e, item.id)}>
                    status
                  </Button>
                  <Menu id={`status-menu ${item.id}`} anchorEl={anchorEL[item.id]} open={anchorEL[item.id]} onClose={handleClose(item.id)}
                    MenuListProps={{'aria-labelledby':`status-menu ${item.id}`}}>
                    {
                      orderStatus.map((status)=><MenuItem key={status.label} onClick={handleUpdateOrderStatus(item.id,status.label)}>
                        {status.label}
                      </MenuItem>
                    )}
                  </Menu>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
