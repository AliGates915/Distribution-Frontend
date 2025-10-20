import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ToastContainer } from "react-toastify";
import ShelveLocation from "./pages/admin/Sales/SetUp/ShelveLocation.jsx";
import "react-toastify/dist/ReactToastify.css";
import ItemCategory from "./pages/admin/Sales/SetUp/ItemCategory.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import SupplierList from "./pages/admin/Sales/SetUp/Supplier.jsx";
import Manufacture from "./pages/admin/Sales/SetUp/Manufacture.jsx";

import ScrollToTop from "./helper/ScrollToTop.jsx";

import Profile from "./components/Profile.jsx";
import CustomerList from "./pages/admin/Sales/SetUp/Customer.jsx";
import Product from "./pages/admin/Sales/SetUp/Product.jsx";
import Bank from "./pages/admin/Sales/SetUp/Bank.jsx";
import SalesSidebar from "./pages/admin/Sales/Functionalities/SalesSideBar.jsx";
import GRN from "./pages/admin/Sales/Functionalities/GRN.jsx";
import PaymentToSupplier from "./pages/admin/Sales/Functionalities/PaymentToSupplier.jsx";
import OrderTaking from "./pages/admin/Sales/Functionalities/OrderTaking.jsx";
import LoadSheet from "./pages/admin/Sales/Functionalities/LoadSheet.jsx";
import SalesInvoice from "./pages/admin/Sales/Functionalities/SalesInvoice.jsx";
import CashDeposite from "./pages/admin/Sales/Functionalities/CashDeposite.jsx";
import LoadReturn from "./pages/admin/Sales/Functionalities/LoadReturn.jsx";
import OpeningBalance from "./pages/admin/Sales/Functionalities/OpeningBalance.jsx";
import ExpenseVoucher from "./pages/admin/Sales/Functionalities/ExpenseVoucher.jsx";
import BankLedger from "./pages/admin/Sales/Reports/BankLedger.jsx";
import CustomerwiseOrders from "./pages/admin/Sales/Reports/CustomerwiseOrders.jsx";
import Employee from "./pages/admin/Sales/SetUp/Employee.jsx";
import Vehicle from "./pages/admin/Sales/SetUp/Vehicle.jsx";
import ItemType from "./pages/admin/Sales/SetUp/ItemType.jsx";

import AmountPayable from "./pages/admin/Sales/Reports/AmountPayable.jsx";
import SupplierLedger from "./pages/admin/Sales/Reports/SupplierLedger.jsx";
import DateWisePurchase from "./pages/admin/Sales/Reports/DateWisePurchase.jsx";
import SupplierWisePurchase from "./pages/admin/Sales/Reports/SupplierWisePurchase.jsx";
import ItemPurchases from "./pages/admin/Sales/Reports/ItemPurchases.jsx";
import CustomerLedger from "./pages/admin/Sales/Reports/CustomerLedger.jsx";
import DateWiseOrder from "./pages/admin/Sales/Reports/DateWiseOrder.jsx";
import ProductWiseOrder from "./pages/admin/Sales/Reports/ProductWiseOrder.jsx";

import DatewiseCashReceived from "./pages/admin/Sales/Reports/DatewiseCashReceived.jsx";
import DatewiseRecovery from "./pages/admin/Sales/Reports/DatewiseRecovery.jsx";
import ItemwiseRecovery from "./pages/admin/Sales/Reports/ItemwiseRecovery.jsx";
import SalesmanwiseOrders from "./pages/admin/Sales/Reports/SalesmanwiseOrders.jsx";
import SalesmanwiseRecoveries from "./pages/admin/Sales/Reports/SalesmanwiseRecoveries.jsx";

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
            <Route path="shelve-location" element={<ShelveLocation />} />
            <Route path="item-category" element={<ItemCategory />} />
            <Route path="supplier" element={<SupplierList />} />
            <Route path="sales" element={<SalesSidebar />} />

            <Route path="manufacture" element={<Manufacture />} />

            <Route path="bank" element={<Bank />} />


            <Route path="sales/grn" element={<GRN />} />

            <Route path="product" element={<Product />} />

            <Route
              path="sales/payment-to-supplier"
              element={<PaymentToSupplier />}
            />
            <Route path="sales/order-taking" element={<OrderTaking />} />
            <Route path="sales/load-sheet" element={<LoadSheet />} />
            <Route path="sales/sales-invoice" element={<SalesInvoice />} />
            <Route path="sales/cash-deposite" element={<CashDeposite />} />
            <Route path="sales/load-return" element={<LoadReturn />} />
            <Route path="sales/opening-balance" element={<OpeningBalance />} />
            <Route path="sales/expense-voucher" element={<ExpenseVoucher />} />

          
           {/* Reports */}
              <Route path="report/amount-payable" element={<AmountPayable />} />
              <Route path="report/supplier-ledger" element={<SupplierLedger />} />
              <Route path="report/datewise-purchase" element={<DateWisePurchase />} />
              <Route path="report/supplierwise-purchase" element={<SupplierWisePurchase />} />
              <Route path="report/item-purchases" element={<ItemPurchases />} />
              <Route path="report/customer-ledger" element={<CustomerLedger />} />
              <Route path="report/datewise-Orders" element={<DateWiseOrder />} />
              <Route path="report/productwise-orders" element={<ProductWiseOrder />} />
           
           
           

            <Route path="report/bank-ledger" element={<BankLedger />} />
            <Route
              path="report/datewise-recovery"
              element={<DatewiseRecovery />}
            />
            <Route
              path="report/datewise-cash-received"
              element={<DatewiseCashReceived />}
            />
            <Route
              path="report/customerwise-orders"
              element={<CustomerwiseOrders />}
            />

            <Route
              path="report/itemwise-recovery"
              element={<ItemwiseRecovery />}
            />
            <Route
              path="report/salesmanwise-orders"
              element={<SalesmanwiseOrders />}
            />
            <Route
              path="report/salesmanwise-recovery"
              element={<SalesmanwiseRecoveries />}
            />

            <Route path="item-type" element={<ItemType />} />
            <Route path="customers-list" element={<CustomerList />} />
            <Route path="employee" element={<Employee />} />
            <Route path="vehicle" element={<Vehicle />} />
          </Route>
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
