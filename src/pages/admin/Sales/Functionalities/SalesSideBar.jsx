import { NavLink } from "react-router-dom";
import {
  FaUndoAlt,
  FaMoneyBillWave,
  FaThList,
  FaUsers,
  FaBox,
  FaIndustry,
  FaWarehouse,
  FaBalanceScale,
  FaBoxOpen,
  FaBook,
  FaBuilding,
  FaCar,
  FaUser,
  FaFileInvoiceDollar,
  FaShoppingCart,
  FaCalendarAlt,
  FaUserTie,
  FaUniversity,
  FaCashRegister,
} from "react-icons/fa";
import { TbFileInvoice } from "react-icons/tb";
import { FaMoneyCheckDollar, FaUsersViewfinder } from "react-icons/fa6";
import { FaTruck } from "react-icons/fa";
import CommanHeader from "../../Components/CommanHeader";
import {
  BadgeEuro,
  CalendarArrowDown,
  DollarSign,
  Banknote,
  FileChartColumnIncreasing,
  FileSpreadsheet,
  Undo2,
  Scale,
  Tickets,
} from "lucide-react";

// salesChildren
const salesChildren = [
  {
    to: "/admin/sales/grn",
    label: "Grn",
    icon: <BadgeEuro />,
  },
  {
    to: "/admin/sales/payment-to-supplier",
    label: "Payment To Supplier",
    icon: <DollarSign />,
  },
  {
    to: "/admin/sales/order-taking",
    label: "Order Taking",
    icon: <CalendarArrowDown />,
  },
  { to: "/admin/sales/load-sheet", label: "Load Sheet", icon: <FileSpreadsheet /> },
  { to: "/admin/sales/sales-invoice", label: "Sales Invoice", icon: <FileChartColumnIncreasing /> },
  { to: "/admin/sales/cash-deposite", label: "Cash Deposite", icon: <Banknote /> },
  { to: "/admin/sales/load-return", label: "Load Return", icon: <Undo2 /> },
  { to: "/admin/sales/opening-balance", label: "Opening Balance", icon: <Scale /> },
  { to: "/admin/sales/expense-voucher", label: "Expense Voucher", icon: <Tickets /> },
];

// setupChildren
const setupChildren = [
  { to: "/admin/customers-list", label: "Customer", icon: <FaUsers /> },
  { to: "/admin/supplier", label: "Supplier", icon: <FaTruck /> },
  { to: "/admin/employee", label: "Employee", icon: <FaUser /> },
  { to: "/admin/vehicle", label: "Vehicle", icon: <FaCar /> },
  { to: "/admin/bank", label: "Bank", icon: <FaUsersViewfinder /> },
  { to: "/admin/item-category", label: "Item Category", icon: <FaThList /> },
  { to: "/admin/item-type", label: "Item Type", icon: <FaBox /> },
  { to: "/admin/manufacture", label: "Manufacture", icon: <FaIndustry /> },
  { to: "/admin/shelve-location", label: "Shelve Location", icon: <FaWarehouse /> },
  { to: "/admin/product", label: "Products", icon: <FaBoxOpen /> },
];

// reportsChildren
const reportsChildren = [
  { to: "/admin/report/amount-payable", label: "Amount Payable", icon: <FaMoneyBillWave /> },
  { to: "/admin/report/supplier-ledger", label: "Supplier Ledger", icon: <FaBook /> },
  { to: "/admin/report/datewise-purchase", label: "Datewise Purchase", icon: <FaCalendarAlt /> },
  { to: "/admin/report/supplierwise-purchase", label: "Supplierwise Purchase", icon: <FaUserTie /> },
  { to: "/admin/report/item-purchases", label: "Item Purchases", icon: <FaBoxOpen /> },
  { to: "/admin/report/customer-ledger", label: "Customer Ledger", icon: <FaUser /> },
  { to: "/admin/report/datewise-orders", label: "Datewise Orders", icon: <FaCalendarAlt /> },
  { to: "/admin/report/productwise-orders", label: "Productwise Orders", icon: <FaShoppingCart /> },
  { to: "/admin/report/salesmanwise-orders", label: "Salesmanwise Orders", icon: <FaUserTie /> },
  { to: "/admin/report/customerwise-orders", label: "Customerwise Orders", icon: <FaUsers /> },
  { to: "/admin/report/bank-ledger", label: "Bank Ledger", icon: <FaUniversity /> },
  { to: "/admin/report/datewise-cash-received", label: "Datewise Cash Received", icon: <FaCashRegister /> },
  { to: "/admin/report/datewise-recovery", label: "Datewise Recovery", icon: <FaCalendarAlt /> },
  { to: "/admin/report/salesmanwise-recovery", label: "Salesmanwise Recoveries", icon: <FaUserTie /> },
  { to: "/admin/report/itemwise-recovery", label: "Itemwise Recovery", icon: <FaBoxOpen /> },
];

const SalesSidebar = () => {
  return (
    <div>
      <CommanHeader />

      <div
        className="p-6 relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/sales-invoice1.jpg')" }}
      >
        {/* Transparent overlay */}
        <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>

        {/* Content Layer */}
        <div className="relative z-10">
          <h1 className="text-2xl text-white font-bold mb-6">Functionalities</h1>

          <div className="bg-gray-400 opacity-80 rounded-xl px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ">
              {salesChildren.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex flex-col items-center justify-center text-white hover:text-green-600 hover:no-underline group transition-all duration-300 hover:bg-emerald-100 h-32 w-60 rounded-2xl"
                >
                  <div className="text-4xl mb-2 text-white group-hover:text-green-700 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-center">{item.label}</h2>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Reports */}
          <h1 className="mt-2 text-2xl text-white font-bold mb-6">Reports</h1>

          <div className="bg-gray-400 opacity-80 rounded-xl px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ">
              {reportsChildren.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex flex-col items-center justify-center text-white hover:text-green-600 hover:no-underline group transition-all duration-300 hover:bg-emerald-100 h-32 w-60 rounded-2xl"
                >
                  <div className="text-4xl mb-2 text-white group-hover:text-green-700 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-center">{item.label}</h2>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Setup */}
          <h1 className="mt-2 text-2xl text-white font-bold mb-6">Setup</h1>

          <div className="bg-gray-400 opacity-80 rounded-xl px-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ">
              {setupChildren.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex flex-col items-center justify-center text-white hover:text-green-600 hover:no-underline group transition-all duration-300 hover:bg-emerald-100 h-32 w-60 rounded-2xl"
                >
                  <div className="text-4xl mb-2 text-white group-hover:text-green-700 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-center">{item.label}</h2>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesSidebar;
