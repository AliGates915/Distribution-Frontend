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



import ScrollToTop from "./helper/ScrollToTop.jsx";




import Profile from "./components/Profile.jsx";
import CustomerList from "./pages/admin/Sales/SetUp/Customer.jsx";
import Tax from "./pages/admin/Sales/SetUp/Tax.jsx";
import FbrCustomers from "./pages/admin/Sales/Functionalities/LoadReturn.jsx";
import FbrProduct from "./pages/admin/Sales/SetUp/FbrProduct.jsx";
import FbrPaymentReceipt from "./pages/admin/Sales/Reports/FbrPaymentReceipt.jsx";
import FbrLedger from "./pages/admin/Sales/Reports/FbrLedger.jsx";
import FbrReceivable from "./pages/admin/Sales/Reports/FbrReceivable.jsx";
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
            <Route path="sales" element={<SalesSidebar />} />


            <Route path="manufacture" element={<Manufacture />} />
            <Route path="item-unit" element={<ItemUnit />} />
      
            <Route path="bank" element={<Bank />} />
        
         
            
      
            {/* fbr */}
            <Route path="fbr-customers" element={<FbrCustomers />} />
            <Route path="fbr-products" element={<FbrProduct />} />
            <Route path="sales/grn" element={<GRN />} />
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
            <Route path="fbr-payment-receipt" element={<FbrPaymentReceipt />} />
            <Route path="fbr-ledger" element={<FbrLedger />} />
            <Route path="fbr-receivable" element={<FbrReceivable />} />
           
            <Route path="tax" element={<Tax />} />
            <Route path="customers-list" element={<CustomerList />} />
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
