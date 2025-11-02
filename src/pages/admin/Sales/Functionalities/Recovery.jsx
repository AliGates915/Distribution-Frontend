import React, { useState, useEffect } from "react";
import { SquarePen } from "lucide-react";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { ScaleLoader } from "react-spinners";

const Recovery = () => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [selectedOrders, setSelectedOrders] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields for edit modal
  const [discountAmount, setDiscountAmount] = useState("");
  const [PreviousBalance, setPreviousBalance] = useState(6000);
  const [receivable, setReceivable] = useState("");
  const [received, setReceived] = useState("");
  const [balance, setBalance] = useState("");

  const salesman = [
    { _id: "1", employeeName: "Ali Raza" },
    { _id: "2", employeeName: "Bilal Ahmed" },
    { _id: "3", employeeName: "Usman Tariq" },
  ];

  const staticData = [
    {
      sr: 1,
      invoiceId: "INV-001",
      date: "2025-10-29",
      customer: "Ahmed Traders",
      salesman: "Ali Raza",
      allow: 20,
      billDays: 30,
      dueDate: "2025-11-28",
      dueDays: 30,
      total: 45000,
      received: 25000,
      previousBalance: 20000,
      balance: 20000,
      items: [
        { srNo: 1, item: "Sugar", rate: 200, qty: 10, total: 2000 },
        { srNo: 2, item: "Rice", rate: 400, qty: 5, total: 2000 },
      ],
    },
    {
      sr: 2,
      invoiceId: "INV-002",
      date: "2025-10-30",
      customer: "Hassan Foods",
      salesman: "Ali Raza",
      allow: 30,
      billDays: 15,
      dueDate: "2025-11-14",
      dueDays: 30,
      total: 32000,
      received: 20000,
      previousBalance: 4000,
      balance: 12000,
      items: [
        { srNo: 1, item: "Flour", rate: 150, qty: 10, total: 1500 },
        { srNo: 2, item: "Oil", rate: 400, qty: 5, total: 2000 },
      ],
    },
    {
      sr: 3,
      invoiceId: "INV-003",
      date: "2025-10-31",
      customer: "Imran Store",
      salesman: "Bilal Ahmed",
      allow: "Yes",
      billDays: 20,
      dueDate: "2025-11-20",
      total: 58000,
      dueDays: 30,
      previousBalance: 245000,
      received: 30000,
      balance: 28000,
      items: [
        { srNo: 1, item: "Tea", rate: 100, qty: 10, total: 1000 },
        { srNo: 2, item: "Sugar", rate: 200, qty: 15, total: 3000 },
      ],
    },
  ];

  const handleSalesmanChange = (e) => {
    const id = e.target.value;
    setSelectedSalesman(id);
    setLoading(true);
    setTimeout(() => {
      const filtered = staticData.filter(
        (item) =>
          salesman.find((s) => s._id === id)?.employeeName === item.salesman
      );
      setData(filtered);
      setLoading(false);
    }, 800);
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setDiscountAmount("");
    setReceivable(invoice.total);
    setReceived(invoice.received);
    setBalance(invoice.balance);
    setPreviousBalance(invoice.previousBalance);
    setIsSliderOpen(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Recovery updated successfully (static mode).",
      confirmButtonColor: "#3085d6",
    });
    setIsSliderOpen(false);
  };

  // Auto recalculation logic like in SalesInvoice
  useEffect(() => {
    if (editingInvoice) {
      const total = editingInvoice.total;
      const discount = parseFloat(discountAmount) || 0;
      const receivableAmt = total - discount;
      setReceivable(receivableAmt);
      const bal = receivableAmt - (parseFloat(received) || 0);
      setBalance(bal);
    }
  }, [discountAmount, received, editingInvoice]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-newPrimary">
            Recovery Report
          </h1>
        </div>

        {/* 🔹 Filter Fields */}
        <div className="flex flex-wrap justify-between items-start gap-8 w-full mt-4">
          {/* Date + Invoice in left column */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-6">
              <label className="text-gray-700 font-medium w-24">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                max={today}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[250px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="text-gray-700 font-medium w-24">
                Invoice ID <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedOrders}
                onChange={(e) => setSelectedOrders(e.target.value)}
                className="w-[250px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
              >
                <option value="">Select Invoice</option>
                {staticData.map((order) => (
                  <option key={order.invoiceId} value={order.invoiceId}>
                    {order.invoiceId}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Salesman dropdown on right side */}
          <div className="flex items-center gap-6 ml-auto">
            <label className="text-gray-700 font-medium w-24">
              Salesman <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSalesman}
              onChange={handleSalesmanChange}
              className="w-[250px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
            >
              <option value="">Select Salesman</option>
              {salesman.map((cust) => (
                <option key={cust._id} value={cust._id}>
                  {cust.employeeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🔹 Table */}
        <div className="p-0 mt-6">
          {selectedSalesman && (
            <div>
              <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                <div className="overflow-y-auto lg:overflow-x-auto max-h-[400px]">
                  <div className="min-w-full custom-scrollbar">
                    <div className="hidden lg:grid grid-cols-[0.2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs whitespace-nowrap font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                      <div>SR</div>
                      <div>Date</div>
                      <div>ID</div>
                      <div>Customer</div>
                      <div>Salesman</div>
                      <div>Total</div>
                      <div>Received</div>
                      <div>Balance</div>
                      <div>Bill Days</div>
                      <div>Due Days</div>
                      <div>Recovery Date</div>
                      <div>Action</div>
                    </div>

                    <div className="flex flex-col divide-y divide-gray-100">
                      {loading ? (
                        <TableSkeleton
                          rows={data.length}
                          cols={12}
                          className="lg:grid-cols-[0.2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                        />
                      ) : data.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 bg-white">
                          No records found.
                        </div>
                      ) : (
                        data.map((item, index) => (
                          <div
                            key={item.invoiceId}
                            className="grid grid-cols-1 lg:grid-cols-[0.2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 whitespace-nowrap px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                          >
                            <div>{index + 1}</div>
                            <div>{formatDate(item.date)}</div>
                            <div>{item.invoiceId}</div>
                            <div>{item.customer}</div>
                            <div>{item.salesman}</div>
                            <div>{item.total}</div>
                            <div>{item.received || 0}</div>
                            <div>{item.balance || item.total}</div>
                            <div>{item.billDays || "-"}</div>
                            <div>{item.dueDays || "-"}</div>
                            <div>{formatDate(item.dueDate)}</div>
                            <div className="flex gap-3 justify-start">
                              <button
                                onClick={() => handleEdit(item)}
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 🔹 Edit Form Modal (Full Functional Like SalesInvoice) */}
        {isSliderOpen && editingInvoice && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
           <div className="relative w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[85vh] md:max-h-[90vh]">

              {isSaving && (
                <div className="absolute top-0 left-0 w-full h-full bg-white/70 flex items-center justify-center z-50">
                  <ScaleLoader color="#1E93AB" size={60} />
                </div>
              )}

              <div className="flex justify-between items-center p-4 border-b bg-white">
                <h2 className="text-xl font-bold text-newPrimary">
                  Edit Recovery
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={() => setIsSliderOpen(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4 p-4 md:p-6">
                <div className="grid grid-cols-2 items-center gap-x-4 gap-y-1 border p-4 rounded-lg">
                  <div className="flex gap-3">
                    <label className="block text-gray-700 font-medium">
                      Recovery Id :
                    </label>
                    <p>REC-001</p>
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="block text-gray-700 font-medium">
                      Recovery Date :
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border h-[30px] border-gray-300 rounded-md p-4 w-[200px] focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 border p-4 rounded-lg">
                  <div className="flex gap-3">
                    <label className="block text-gray-700 font-medium">
                      Invoice No. :
                    </label>
                    <p>{editingInvoice.invoiceId}</p>
                  </div>
                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Invoice Date :
                    </label>
                    <p>{formatDate(editingInvoice.date)}</p>
                  </div>
                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Customer :
                    </label>
                    <p>{editingInvoice.customer}</p>
                  </div>
                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Salesman :
                    </label>
                    <p>{editingInvoice.salesman}</p>
                  </div>
                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Previous Balance :
                    </label>
                    <p>{editingInvoice.previousBalance}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Items
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-[60px_2fr_1fr_1fr_1fr] bg-gray-200 text-gray-600 text-sm font-semibold uppercase border-b border-gray-300">
                      <div className="px-4 py-2 border-r border-gray-300">
                        SR#
                      </div>
                      <div className="px-4 py-2 border-r border-gray-300">
                        Item
                      </div>
                      <div className="px-4 py-2 border-r border-gray-300">
                        Rate
                      </div>
                      <div className="px-4 py-2 border-r border-gray-300">
                        Qty
                      </div>
                      <div className="px-4 py-2">Total</div>
                    </div>
                    {editingInvoice.items.map((item, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[60px_2fr_1fr_1fr_1fr] text-sm text-gray-700 bg-gray-100 even:bg-white border-t border-gray-300"
                      >
                        <div className="px-4 py-2 border-r border-gray-300">
                          {i + 1}
                        </div>
                        <div className="px-4 py-2 border-r border-gray-300">
                          {item.item}
                        </div>
                        <div className="px-4 py-2 border-r border-gray-300 ">
                          {item.rate}
                        </div>
                        <div className="px-4 py-2 border-r border-gray-300 ">
                          {item.qty}
                        </div>
                        <div className="px-4 py-2 ">{item.total}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals + Aging Date + Discounts */}
                <div className="flex flex-col w-full items-end gap-4 mt-4">
                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Total Price
                    </label>
                    <input
                      type="number"
                      value={editingInvoice.total}
                      disabled
                      readOnly
                      className="w-[200px] h-[40px] p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Receivable
                    </label>
                    <input
                      type="number"
                      value={receivable}
                      readOnly
                      disabled
                      className="w-[200px] h-[40px] p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Received
                    </label>
                    <input
                      type="number"
                      value={received}
                      onChange={(e) => setReceived(e.target.value)}
                      className="w-[200px] h-[40px] p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex w-full items-start gap-6">
                    <div className="flex-1">
                      <p className="ml-auto font-bold ">
                        Allow Days : {editingInvoice.allow}
                      </p>
                      <p className="ml-auto font-bold ">
                        Over Days : {editingInvoice.dueDays}
                      </p>

                      <div className="flex  gap-3 mt-2">
                        <label className="block text-gray-700 font-medium">
                          Aging Date
                        </label>
                        <input
                          type="date"
                          value={editingInvoice.dueDate}
                          disabled
                          readOnly
                          className="w-[200px] h-[40px] px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        />
                      </div>
                    </div>

                    <div className="flex  gap-1">
                      <label className="block text-gray-700 font-medium">
                        Balance
                      </label>
                      <input
                        type="number"
                        value={balance}
                        disabled
                        readOnly
                        className="w-[200px] h-[40px] px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Balance amount"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors"
                >
                  Update Recovery
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #edf2f7;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #a0aec0;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
      `}</style>
    </div>
  );
};

export default Recovery;
