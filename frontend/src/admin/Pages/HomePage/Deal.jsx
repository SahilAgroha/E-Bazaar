import React, { useState } from "react";
import { Button, Dialog, DialogContent } from "@mui/material";
import DealTable from "./DealTable";
import EditDealForm from "./EditDealForm";
import DealCategoryTable from "./DealCategoryTable";
import CreateDealForm from "./CreateDealForm";
import AddDealCategoryForm from "./AddDealCategoryForm";

const tabs = ["Deals", "Category", "Create Deal", "Add Deal Category"];

const Deal = () => {
  const [activeTab, setActiveTab] = useState("Deals");
  const [editingDeal, setEditingDeal] = useState(null);

  const handleCloseDialog = () => setEditingDeal(null);

  return (
    <div>
      <div className="flex gap-4">
        {tabs.map((item) => (
          <Button
            key={item}
            onClick={() => setActiveTab(item)}
            variant={activeTab === item ? "contained" : "outlined"}
          >
            {item}
          </Button>
        ))}
      </div>

      <div className="mt-5">
        {activeTab === "Deals" && (
          <DealTable onEdit={(deal) => setEditingDeal(deal)} />
        )}
        {activeTab === "Category" && <DealCategoryTable />}
        {activeTab === "Create Deal" && <CreateDealForm />}
        {activeTab === "Add Deal Category" && <AddDealCategoryForm />}
      </div>

      {/* ✅ POPUP MODAL */}
      <Dialog
        open={Boolean(editingDeal)}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          {editingDeal && (
            <EditDealForm deal={editingDeal} onClose={handleCloseDialog} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Deal;