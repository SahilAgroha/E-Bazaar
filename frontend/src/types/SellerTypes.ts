export interface PickupAddress {
  name: string;
  mobile: string;
  pincode: string;
  address: string;
  locality: string;
  city: string;
  state: string;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface BusinessDetails {
  businessName: string;
}

export type AccountStatus =
  | "PENDING_VERIFICATION"
  | "ACTIVE"
  | "SUSPENDED"
  | "DEACTIVATED"
  | "BANNED"
  | "CLOSED";


export const AccountStatus = {
  PENDING_VERIFICATION:"PENDING_VERIFICATION",
    ACTIVE:"ACTIVE",
    SUSPENDED:"SUSPENDED",
    DEACTIVATED:"DEACTIVATED",
    BANNED:"BANNED",
    CLOSED:"CLOSED"
};


export interface Seller {
  id?: number;
  mobile: string;
  otp?: string; // ⬅️ OTP only during login/verification
  GSTIN: string;
  pickupAddress: PickupAddress;
  bankDetails: BankDetails;
  sellerName: string;
  email: string;
  businessDetails: BusinessDetails;
  password?: string; // ⬅️ hide in UI
  accountStatus?: AccountStatus;
}

export interface SellerReport {
  id: number;
  seller: Seller;
  totalEarning: number;
  totalSales: number;
  totalRefunds: number;   // ⬅️ fix spelling
  totalTax: number;
  netEarning: number;     // ⬅️ fix name (backend has netEarning, not netEarnings)
  totalOrders: number;
  cancelOrders: number;   // ⬅️ fix spelling (backend field)
  totalTransactions: number;
}
