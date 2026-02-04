import { useState } from "react";
import { Button } from "@mui/material";
import SellerTable from "./SellerTable";
import TransactionTable from "./TransactionTable";
import SellerReport from "./SellerReport";

const tabs = ["Sellers", "Transactions", "Report"];

const SellerManagement = () => {
  const [activeTab, setActiveTab] = useState("Sellers");

  return (
    <div>
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "contained" : "outlined"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
      <div className="mt-5">
        {activeTab === "Sellers" && <SellerTable />}
        {activeTab === "Transactions" && <TransactionTable />}
        {activeTab === "Report" && <SellerReport />}
      </div>
    </div>
  );
};

export default SellerManagement;
