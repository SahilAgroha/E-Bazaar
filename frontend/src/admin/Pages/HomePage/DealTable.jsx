import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { getAllDeals, deleteDeal } from "../../../State/admin/DealSlice";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function DealTable({ onEdit }) {
  const dispatch = useAppDispatch();
  const { deals } = useAppSelector((store) => store.deal);

  useEffect(() => {
    dispatch(getAllDeals());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteDeal(id));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Discount</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {deals.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <img src={item.category.image} alt="" className="w-20 rounded" />
              </TableCell>
              <TableCell>{item.category.name}</TableCell>
              <TableCell>{item.discount}%</TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(item)}>
                  <Edit />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => handleDelete(item.id)}>
                  <Delete sx={{ color: "red" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}