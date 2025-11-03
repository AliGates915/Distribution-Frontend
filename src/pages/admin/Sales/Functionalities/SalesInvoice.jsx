import React, { useState, useEffect, useRef, useCallback } from "react";
import { Eye, Loader, SquarePen } from "lucide-react";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { ScaleLoader } from "react-spinners";
import { InvoiceTemplate } from "../../../../helper/InvoiceTemplate";
import axios from "axios";
import { use } from "react";
import { api } from "../../../../context/ApiService";

const SalesInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [isSaving, setIsSaving] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [salesman, setSalesman] = useState("");
  const [salesmanList, setSalesmanList] = useState([]);
  const [previousBalance, setPreviousBalance] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState("");
  const [receivable, setReceivable] = useState("");
  const [received, setReceived] = useState("");
  const [balance, setBalance] = useState("");
  const [receivingDate, setReceivingDate] = useState("");
  const [isView, setIsView] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const invoiceRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const headers = {
    headers: {
      Authorization: `Bearer ${userInfo?.token}`,
    },
  };
 
// ✅ Fetch all or filtered pending orders
async function fetchSalesInvoiceList() {
  try {
    setLoading(true);

    let url = `${import.meta.env.VITE_API_BASE_URL}/order-taker/pending`;
    let config = { headers };

    // If salesman is selected, apply filter query
    if (selectedSalesman) {
      config.params = {
        date: date,
        salesmanId: selectedSalesman,
      };
    } 

    const res = await axios.get(url, config);

    // ✅ Handle response
    setInvoices(res.data?.data || []);
    console.log("✅ Pending Orders Response:", res.data);
  } catch (error) {
    console.error("❌ Failed to fetch SalesInvoice:", error);
    toast.error("Failed to fetch pending orders");
  } finally {
    setTimeout(() => setLoading(false), 500);
  }
}



// 🔹 Load all data initially
useEffect(() => {
  fetchSalesInvoiceList();
}, []);

// 🔹 Re-fetch when date or salesman changes
useEffect(() => {
  if (selectedSalesman || date) {
    fetchSalesInvoiceList();
  }
}, [selectedSalesman, date]);



  // salesmanList
  const fetchSaleman = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/employees/salesman`);
      
setSalesmanList(response.employees);
    } catch (error) {
      console.error(" Failed to fetch customers by salesman:", error);
     
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };
  useEffect(() => {
    fetchSaleman();
  },[])
 
  
  // ✅ Format date
  const formDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // ✅ Edit handler
  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setInvoiceId(invoice.orderId);
    setInvoiceDate(invoice.date);
    setCustomer(invoice.customerId.customerName);
    setSalesman(invoice.salesmanId.employeeName);
    setPreviousBalance(invoice.customerId.salesBalance);
    setDeliveryDate(new Date().toISOString().split("T")[0]); // current date

    // map products correctly
    const mappedItems = invoice.products.map((p) => ({
      item: p.itemName,
      rate: p.rate,
      qty: p.qty,
      total: p.totalAmount,
    }));
    setItems(mappedItems);

    setTotalPrice(invoice.totalAmount);
    setDiscountAmount("");
    setReceivable(invoice.totalAmount);
    setReceived("");
    setBalance(invoice.totalAmount);
    setReceivingDate(invoice.customerId.timeLimit?.split("T")[0] || "");
    setIsSliderOpen(true);
  };

  // ✅ Total recalculation
  useEffect(() => {
    const total = items.reduce((acc, item) => acc + item.total, 0);
    setTotalPrice(total);
    const discount = parseFloat(discountAmount) || 0;
    const receivableAmt = total - discount;
    setReceivable(receivableAmt);
    const bal = receivableAmt - (parseFloat(received) || 0);
    setBalance(bal);
  }, [items, discountAmount, received]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      const payload = {
        invoiceNo: invoiceId,
        invoiceDate: new Date().toISOString().split("T")[0],
        customerId: editingInvoice.customerId._id,
        salesmanId: editingInvoice.salesmanId._id,
        orderTakingId: editingInvoice._id,
        products: items.map((item) => ({
          itemName: item.item,
          rate: item.rate,
          qty: item.qty,
          totalAmount: item.total,
        })),
        totalAmount: receivable,
        receivable: receivable,
        received: parseFloat(received) || 0,
        deliveryDate: deliveryDate,
        status: "Pending", // default
      };
      console.log("🧾 Payload to send:", payload);

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/sales-invoice`,
        payload,
        headers
      );

      Swal.fire({
        icon: "success",
        title: "Invoice Created!",
        text: "Invoice posted successfully to server.",
        confirmButtonColor: "#3085d6",
      });

      setIsSliderOpen(false);
      fetchSalesInvoiceList();
    } catch (error) {
      console.error(" Invoice post error:", error);
      toast.error(error.response?.data?.message || "Failed to post invoice");
    } finally {
      setIsSaving(false);
    }
  };

  // 🔢 Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = invoices.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(invoices.length / recordsPerPage);

  return (
   <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />

      {loading ? (
        <div className="w-full flex justify-center items-center h-screen">
          <Loader size={70} className="animate-spin" />
        </div>
      ) : (
        <>
          {/* 🔹 Header and Filters */}
          <div className="px-6 mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-newPrimary">
                Pending Orders
              </h1>
            </div>

            <div className="flex flex-wrap justify-between items-start gap-8 w-full mt-4 mb-5">
              <div className="flex gap-8">
                <div className="flex items-center gap-6">
                  <label className="text-gray-700 font-medium w-24">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    max={today}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-[250px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <label className="text-gray-700 font-medium w-24">
                    Salesman <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedSalesman}
                    onChange={(e) => setSelectedSalesman(e.target.value)}
                    className="w-[250px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                  >
                    <option value="">Select Salesman</option>
                    {salesmanList.map((cust) => (
                      <option key={cust._id} value={cust._id}>
                        {cust.employeeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ✅ Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-y-auto lg:overflow-x-auto max-h-[800px]">
                <div className="min-w-[1000px]">
                  <div className="hidden lg:grid grid-cols-[0.2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                    <div>SR</div>
                    <div>Order ID</div>
                    <div>Order Date</div>
                    <div>Salesman</div>
                    <div>Customer</div>
                    <div>Amount</div>
                    <div>Action</div>
                  </div>

                  <div className="flex flex-col divide-y divide-gray-100">
                    {invoices.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 bg-white">
                        No Sales Invoice Found
                      </div>
                    ) : (
                      currentRecords.map((invoice, index) => (
                        <div
                          key={invoice._id}
                          className="grid grid-cols-1 lg:grid-cols-[0.2fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                        >
                          <div>{indexOfFirstRecord + index + 1}</div>
                          <div>{invoice.orderId || "-"}</div>
                          <div>{formDate(invoice.date) || "-"}</div>
                          <div>{invoice.salesmanId.employeeName || "-"}</div>
                          <div>{invoice.customerId.customerName || "-"}</div>
                          <div>{invoice.customerId.salesBalance || "-"}</div>
                          <div className="flex gap-3 justify-start">
                            <button
                              onClick={() => handleEdit(invoice)}
                              className="text-blue-600 hover:bg-blue-50 rounded p-1 transition-colors"
                              title="Edit"
                            >
                              <SquarePen size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-between items-center py-4 px-6 bg-white border-t">
                      <p className="text-sm text-gray-600">
                        Showing {indexOfFirstRecord + 1} to{" "}
                        {Math.min(indexOfLastRecord, invoices.length)} of{" "}
                        {invoices.length} invoices
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === 1
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-newPrimary text-white hover:bg-newPrimary/80"
                          }`}
                        >
                          Previous
                        </button>
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === totalPages
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-newPrimary text-white hover:bg-newPrimary/80"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 🧾 Invoice View Modal */}
      {isView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] md:w-[70%] lg:w-[60%] max-h-[90vh] overflow-y-auto p-5 relative shadow-lg">
            <button
              onClick={() => setIsView(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-center mb-4">
              Invoice Details
            </h2>
            <InvoiceTemplate invoice={selectedInvoice} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesInvoice;
