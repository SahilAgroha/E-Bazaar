import { useEffect } from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchAllTransactions } from "../../../State/admin/SellerSlice";

const TransactionTable = () => {
  const dispatch = useAppDispatch();
  const { transactions } = useAppSelector((store) => store.seller);

  useEffect(() => {
    dispatch(fetchAllTransactions());
  }, [dispatch]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Seller</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((txn) => (
          <TableRow key={txn.id}>
            <TableCell>{txn.id}</TableCell>
            <TableCell>{txn.seller?.name}</TableCell>
            <TableCell>{txn.amount}</TableCell>
            <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
            <TableCell>{txn.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
