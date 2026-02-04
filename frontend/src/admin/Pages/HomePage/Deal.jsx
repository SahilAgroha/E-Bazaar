import React, { useState } from "react";
import DealTable from "./DealTable";
import EditDealForm from "./EditDealForm";
import DealCategoryTable from "./DealCategoryTable";
import CreateDealForm from "./CreateDealForm";
import AddDealCategoryForm from "./AddDealCategoryForm";
import { Button } from "@mui/material";

const tabs = ["Deals", "Category", "Create Deal", "Add Deal Category"];

const Deal = () => {
  const [activeTab, setActiveTab] = useState("Deals");
  const [editingDeal, setEditingDeal] = useState(null);

  return (
    <div>
      <div className="flex gap-4">
        {tabs.map((item) => (
          <Button
            key={item}
            onClick={() => {
              setActiveTab(item);
              setEditingDeal(null); // reset edit mode when switching tabs
            }}
            variant={activeTab === item ? "contained" : "outlined"}
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="mt-5">
        {editingDeal ? (
          <EditDealForm deal={editingDeal} onClose={() => setEditingDeal(null)} />
        ) : activeTab === "Deals" ? (
          <DealTable onEdit={(deal) => setEditingDeal(deal)} />
        ) : activeTab === "Category" ? (
          <DealCategoryTable />
        ) : activeTab === "Create Deal" ? (
          <div className="mt-5 flex flex-col justify-center items-center h-[70vh]">
            <CreateDealForm />
          </div>
        ) : (
          <div className="mt-5 flex flex-col justify-center items-center h-[70vh]">
            <AddDealCategoryForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Deal;
