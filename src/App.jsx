import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { Toaster } from "react-hot-toast";

import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./helper/ScrollToTop.jsx";
import Profile from "./components/Profile.jsx";
import SalesSidebar from "./pages/admin/Sales/Functionalities/SalesSideBar.jsx";

import OrderTaking from "./pages/admin/Sales/Functionalities/OrderTaking.jsx";
import LoadSheet from "./pages/admin/Sales/Functionalities/LoadSheet.jsx";
import SalesInvoice from "./pages/admin/Sales/Functionalities/SalesInvoice.jsx";
import CashDeposite from "./pages/admin/Sales/Functionalities/CashDeposite.jsx";
import LoadReturn from "./pages/admin/Sales/Functionalities/LoadReturn.jsx";

import CustomerwiseOrders from "./pages/admin/Sales/Reports/CustomerwiseOrders.jsx";
import CustomerLedger from "./pages/admin/Sales/Reports/CustomerLedger.jsx";
import DateWiseOrder from "./pages/admin/Sales/Reports/DateWiseOrder.jsx";
import ProductWiseOrder from "./pages/admin/Sales/Reports/ProductWiseOrder.jsx";

import SalesmanwiseOrders from "./pages/admin/Sales/Reports/SalesmanwiseOrders.jsx";

// =================== PURCHASE SECTION IMPORTS ===================

import PurchaseSideBar from "./pages/admin/Purchase/Functionalities/PurchaseSideBar.jsx";
import PurchaseGRN from "./pages/admin/Purchase/Functionalities/GRN.jsx";
import PurchasePaymentToSupplier from "./pages/admin/Purchase/Functionalities/PaymentToSupplier.jsx";

import PurchaseAmountPayable from "./pages/admin/Purchase/Reports/AmountPayable.jsx";
import PurchaseDateWisePurchase from "./pages/admin/Purchase/Reports/DateWisePurchase.jsx";
import PurchaseItemWisePurchases from "./pages/admin/Purchase/Reports/ItemWisePurchases.jsx";
import PurchaseSupplierLedger from "./pages/admin/Purchase/Reports/SupplierLedger.jsx";
import PurchaseSupplierWisePurchase from "./pages/admin/Purchase/Reports/SupplierWisePurchase.jsx";

import DefineSupplier from "./pages/admin/Purchase/SetUp/DefineSupplier.jsx";
import AmountReceivales from "./pages/admin/Sales/Reports/AmountReceivales.jsx";
import ListOfItems from "./pages/admin/Sales/SetUp/ListOfItems.jsx";
import DefineCustomers from "./pages/admin/Sales/SetUp/DefineCustomers.jsx";
import VehicleInformation from "./pages/admin/Sales/SetUp/VehicleInformation.jsx";
import EmployeeInformation from "./pages/admin/Sales/SetUp/EmployeeInformation.jsx";

// =================== ACCOUNTS SECTION IMPORTS 

import AccountSideBar from "./pages/admin/Accounts/Functionalities/AccountSideBar.jsx";
import ExpenseVoucher from "./pages/admin/Accounts/Functionalities/ExpenseVoucher.jsx";
import OpeningStock from "./pages/admin/Accounts/Functionalities/OpeningStock.jsx";

import BankLedger from "./pages/admin/Accounts/Reports/BankLedger.jsx";
import DateWiseCashRecived from "./pages/admin/Accounts/Reports/DateWiseCashRecived.jsx";
import DateWiseRecovery from "./pages/admin/Accounts/Reports/DateWiseRecovery.jsx";
import ItemWiseRecovery from "./pages/admin/Accounts/Reports/ItemWiseRecovery.jsx";
import SalesmanWiseRecovery from "./pages/admin/Accounts/Reports/SalesmanWiseRecovery.jsx";

import DefineBank from "./pages/admin/Accounts/SetUp/DefineBank.jsx";

function AppContent() {
  return (
    <div className="max-h-screen flex flex-col bg-gray-50">
      <main className="flex-1">
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}

          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="sales" element={<SalesSidebar />} />

            {/* Sales */}
            <Route path="sales/order-taking" element={<OrderTaking />} />
            <Route path="sales/load-sheet" element={<LoadSheet />} />
            <Route path="sales/sales-invoice" element={<SalesInvoice />} />
            <Route path="sales/cash-deposite" element={<CashDeposite />} />
            <Route path="sales/load-return" element={<LoadReturn />} />

            {/* Reports */}
            <Route
              path="report/amount-receivable"
              element={<AmountReceivales />}
            />

            <Route path="report/customer-ledger" element={<CustomerLedger />} />
            <Route path="report/datewise-orders" element={<DateWiseOrder />} />
            <Route
              path="report/productwise-orders"
              element={<ProductWiseOrder />}
            />

            <Route
              path="report/customerwise-orders"
              element={<CustomerwiseOrders />}
            />

            <Route
              path="report/salesmanwise-orders"
              element={<SalesmanwiseOrders />}
            />
            {/* setup */}
            <Route path="define-customers" element={<DefineCustomers />} />
            <Route path="list-of-items" element={<ListOfItems />} />
            <Route
              path="employee-information"
              element={<EmployeeInformation />}
            />
            <Route
              path="vehicle-information"
              element={<VehicleInformation />}
            />

            {/* =================== PURCHASE SECTION =================== */}

            <Route path="purchase" element={<PurchaseSideBar />} />

            {/* Functionalities */}
            <Route path="purchase/grn" element={<PurchaseGRN />} />
            <Route
              path="purchase/payment-to-supplier"
              element={<PurchasePaymentToSupplier />}
            />

            {/* Reports */}
            <Route
              path="purchase/amount-payable"
              element={<PurchaseAmountPayable />}
            />
            <Route
              path="purchase/datewise-purchase"
              element={<PurchaseDateWisePurchase />}
            />
            <Route
              path="purchase/itemwise-purchases"
              element={<PurchaseItemWisePurchases />}
            />
            <Route
              path="purchase/supplier-ledger"
              element={<PurchaseSupplierLedger />}
            />
            <Route
              path="purchase/supplierwise-purchase"
              element={<PurchaseSupplierWisePurchase />}
            />

            {/* Setup */}
            <Route
              path="purchase/define-supplier"
              element={<DefineSupplier />}
            />

            {/* =================== ACCOUNTS SECTION =================== */}

            <Route path="accounts" element={<AccountSideBar />} />

            {/* Functionalities */}
            <Route
              path="accounts/expense-voucher"
              element={<ExpenseVoucher />}
            />
            <Route path="accounts/opening-stock" element={<OpeningStock />} />

            {/* Reports */}
            <Route path="accounts/bank-ledger" element={<BankLedger />} />
            <Route
              path="accounts/datewise-cashrecived"
              element={<DateWiseCashRecived />}
            />
            <Route
              path="accounts/datewise-recovery"
              element={<DateWiseRecovery />}
            />
            <Route
              path="accounts/itemwise-recovery"
              element={<ItemWiseRecovery />}
            />
            <Route
              path="accounts/salesmanwise-recovery"
              element={<SalesmanWiseRecovery />}
            />

            {/* Setup */}
            <Route path="accounts/define-bank" element={<DefineBank />} />
          </Route>
        </Routes>
      </main>
      <Toaster position="top-right" autoClose={2000} />
      
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
