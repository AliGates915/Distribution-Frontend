import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/admin/Login";
import Signup from "./pages/admin/Signup";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ItemList from "./pages/admin/Sales/SetUp/ItemList.jsx";
import { ToastContainer } from "react-toastify";
import ShelveLocation from "./pages/admin/Sales/SetUp/ShelveLocation.jsx";
import "react-toastify/dist/ReactToastify.css";
import CategoryItem from "./pages/admin/Sales/SetUp/CategoryItem.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import SupplierList from "./pages/admin/Sales/SetUp/Supplier.jsx";
import Manufacture from "./pages/admin/Sales/SetUp/Manufacture.jsx";
import ItemUnit from "./pages/admin/Sales/SetUp/ItemUnit.jsx";

import ItemType from "./pages/admin/Sales/Functionalities/ItemType.jsx";
import ScrollToTop from "./helper/ScrollToTop.jsx";

import DeliveryChallan from "./pages/admin/Sales/Functionalities/DeliveryChallan.jsx";
import SalesInvoices from "./pages/admin/Sales/Functionalities/SalesInvoices.jsx";
import SalesReturn from "./pages/admin/Sales/Functionalities/SalesReturn.jsx";
import Profile from "./components/Profile.jsx";
import CustomerList from "./pages/admin/Sales/SetUp/Customer.jsx";
import Tax from "./pages/admin/Sales/SetUp/Tax.jsx";
import FbrCustomers from "./pages/admin/Sales/Functionalities/FbrCustomers.jsx";
import FbrProduct from "./pages/admin/Sales/SetUp/FbrProduct.jsx";
import FbrBookingOrders from "./pages/admin/Sales/Functionalities/FbrBookingOrders.jsx";
import FbrDeliveryChallan from "./pages/admin/Sales/Functionalities/FbrDeliveryChallan.jsx";
import FbrSalesInvoices from "./pages/admin/Sales/Functionalities/FbrSalesInvoices.jsx";
import FbrSalesReturn from "./pages/admin/Sales/Functionalities/FbrSalesReturn.jsx";
import FbrPaymentReceipt from "./pages/admin/Sales/Reports/FbrPaymentReceipt.jsx";
import FbrLedger from "./pages/admin/Sales/Reports/FbrLedger.jsx";
import FbrReceivable from "./pages/admin/Sales/Reports/FbrReceivable.jsx";
import FbrPage from "./pages/admin/Sales/Functionalities/FbrPage.jsx";
import Bank from "./pages/admin/Sales/SetUp/Bank.jsx";
import Employee from "./pages/admin/Sales/SetUp/Employee.jsx";
import Vehicle from "./pages/admin/Sales/SetUp/Vehicle.jsx";
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
            <Route path="item-details" element={<ItemList />} />
            <Route path="shelve-location" element={<ShelveLocation />} />
            <Route path="category-item" element={<CategoryItem />} />
            <Route path="supplier" element={<SupplierList />} />
            <Route path="fbr-integration" element={<FbrPage />} />

            <Route path="manufacture" element={<Manufacture />} />
            <Route path="item-unit" element={<ItemUnit />} />

            <Route path="bank" element={<Bank />} />
            <Route path="delivery-challan" element={<DeliveryChallan />} />

            <Route path="sales-invoices" element={<SalesInvoices />} />

            <Route path="sales-return" element={<SalesReturn />} />
            {/* fbr */}
            <Route path="fbr-customers" element={<FbrCustomers />} />
            <Route path="fbr-products" element={<FbrProduct />} />
            <Route path="fbr-booking-orders" element={<FbrBookingOrders />} />
            <Route
              path="fbr-delivery-challan"
              element={<FbrDeliveryChallan />}
            />
            <Route path="fbr-sale-invoice" element={<FbrSalesInvoices />} />
            <Route path="fbr-sales-return" element={<FbrSalesReturn />} />
            <Route path="fbr-payment-receipt" element={<FbrPaymentReceipt />} />
            <Route path="fbr-ledger" element={<FbrLedger />} />
            <Route path="fbr-receivable" element={<FbrReceivable />} />
            <Route path="item-type" element={<ItemType />} />
            <Route path="tax" element={<Tax />} />
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
