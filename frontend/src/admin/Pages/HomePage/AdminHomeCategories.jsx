import React, { useEffect, useState } from "react";
import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchHomePageData } from "../../../State/customer/customerSlice";

const AdminHomeCategories = () => {
  const dispatch = useAppDispatch();
  const { homePageData, loading } = useAppSelector((state) => state.customer);
  const jwt = localStorage.getItem("jwt");

  console.log("homePageData from state:", homePageData);

  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    if (jwt) {
      dispatch(fetchHomePageData({ jwt } ));
    }
  }, [dispatch, jwt]);

  console.log("Combined categories:", homePageData);

  const categories = [
    ...(homePageData?.grid || []),
    ...(homePageData?.shopByCategories || []),
    ...(homePageData?.electricCategories || []),
    ...(homePageData?.dealCategories || []),
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Home Categories</h2>
      <CategoryForm editingCategory={editingCategory} setEditingCategory={setEditingCategory} />
      <CategoryTable categories={categories} setEditingCategory={setEditingCategory} />
    </div>
  );
};

export default AdminHomeCategories;
