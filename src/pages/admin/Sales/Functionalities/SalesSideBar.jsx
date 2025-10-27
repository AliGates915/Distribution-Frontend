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
  FaMapMarkerAlt,
} from "react-icons/fa";
import { TbFileInvoice } from "react-icons/tb";
import { FaMoneyCheckDollar, FaUsersViewfinder } from "react-icons/fa6";
import { AiOutlineProduct } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";

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
import CommanHeader from "../../Components/CommanHeader";

// salesChildren
const salesChildren = [
  {
    to: "/admin/sales/order-taking",
    label: "Order Taking",
    icon: <CalendarArrowDown strokeWidth={3} size={40} />,
  },
  {
    to: "/admin/sales/load-sheet",
    label: "Load Sheet",
    icon: <FileSpreadsheet strokeWidth={3} size={40} />,
  },
  {
    to: "/admin/sales/sales-invoice",
    label: "Sales Invoice",
    icon: <FileChartColumnIncreasing strokeWidth={3} size={40} />,
  },
  {
    to: "/admin/sales/cash-deposite",
    label: "Cash Deposit",
    icon: <Banknote strokeWidth={3} size={40} />,
  },
  {
    to: "/admin/sales/load-return",
    label: "Load Return",
    icon: <Undo2 strokeWidth={3} size={40} />,
  },
];

// setupChildren
const setupChildren = [
  {
    to: "/admin/sales-area",
    label: "Sales Area",
    icon: <FaMapMarkerAlt />,
  },
  {
    to: "/admin/list-of-items",
    label: "List Of Items",
    icon: <AiOutlineProduct />,
  },
  {
    to: "/admin/define-customers",
    label: "Define Customers",
    icon: <FaUsers />,
  },
  {
    to: "/admin/employee-information",
    label: "Employee Information",
    icon: <FaUser />,
  },
  {
    to: "/admin/vehicle-information",
    label: "Vehicle Information",
    icon: <FaCar />,
  },
];

// reportsChildren
const reportsChildren = [
  {
    to: "/admin/report/amount-receivable",
    label: "Amount Receivable",
    icon: <FaMoneyBillWave />,
  },
  {
    to: "/admin/report/customer-ledger",
    label: "Customer Ledger",
    icon: <FaUser />,
  },
  {
    to: "/admin/report/datewise-orders",
    label: "Datewise Orders",
    icon: <FaCalendarAlt />,
  },
  {
    to: "/admin/report/productwise-orders",
    label: "Productwise Orders",
    icon: <FaShoppingCart />,
  },
  {
    to: "/admin/report/salesmanwise-orders",
    label: "Salesmanwise Orders",
    icon: <FaUserTie />,
  },
  {
    to: "/admin/report/customerwise-orders",
    label: "Customerwise Orders",
    icon: <FaUsers />,
  },
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
          <h1 className="text-2xl text-white font-bold mb-6">
            Functionalities
          </h1>

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
                  <h2 className="text-lg font-semibold text-center">
                    {item.label}
                  </h2>
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
                  <h2 className="text-lg font-semibold text-center">
                    {item.label}
                  </h2>
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
                  <h2 className="text-lg font-semibold text-center">
                    {item.label}
                  </h2>
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
