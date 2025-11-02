import React, { useState, useEffect, useRef, useCallback } from "react";
import { Eye, SquarePen } from "lucide-react";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { ScaleLoader } from "react-spinners";
import { InvoiceTemplate } from "../../../../helper/InvoiceTemplate";

const SalesInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [salesman, setSalesman] = useState("");
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

  // ✅ Static dummy data
  useEffect(() => {
    const dummyInvoices = [
      {
        _id: "1",
        invoiceNo: "INV-001",
        invoiceDate: "2025-11-01",
        salesman: "Ali",
        customer: "Eman Ali",
        amount: 6000,
        previousBalance: 1500,
        receivingDate: "2025-11-01",
        items: [
          { srNo: 1, item: "Sugar", rate: 200, qty: 10, total: 2000 },
          { srNo: 2, item: "Flour", rate: 150, qty: 20, total: 3000 },
          { srNo: 3, item: "Tea", rate: 100, qty: 10, total: 1000 },
        ],
      },
      {
        _id: "2",
        invoiceNo: "INV-002",
        invoiceDate: "2025-10-25",
        salesman: "Usman",
        customer: "Ahsan Traders",
        amount: 8500,
        previousBalance: 2000,
        receivingDate: "2025-10-26",
        items: [
          { srNo: 1, item: "Oil", rate: 400, qty: 10, total: 4000 },
          { srNo: 2, item: "Rice", rate: 450, qty: 10, total: 4500 },
        ],
      },
    ];
    setInvoices(dummyInvoices);
  }, []);

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
    setInvoiceId(invoice.invoiceNo);
    setInvoiceDate(invoice.invoiceDate);
    setCustomer(invoice.customer);
    setSalesman(invoice.salesman);
    setPreviousBalance(invoice.previousBalance);
    setDeliveryDate(new Date().toISOString().split("T")[0]); // current date
    setItems(invoice.items);
    setTotalPrice(invoice.amount);
    setDiscountAmount("");
    setReceivable(invoice.amount);
    setReceived("");
    setBalance(invoice.amount);
    setReceivingDate(invoice.receivingDate);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Invoice updated successfully (static mode).",
      confirmButtonColor: "#3085d6",
    });
    setIsSliderOpen(false);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-newPrimary">Pending Orders</h1>
        </div>

        {/* ✅ Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[800px]">
            <div className="min-w-[1000px]">
              <div className="hidden lg:grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>SR</div>
                <div>Invoice ID</div>
                <div>Invoice Date</div>
                <div>Salesman</div>
                <div>Customer</div>
                <div>Amount</div>
                <div>Action</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100">
                {invoices.map((invoice, index) => (
                  <div
                    key={invoice._id}
                    className="grid grid-cols-1 lg:grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                  >
                    <div>{index + 1}</div>
                    <div>{invoice.invoiceNo}</div>
                    <div>{formDate(invoice.invoiceDate)}</div>
                    <div>{invoice.salesman}</div>
                    <div>{invoice.customer}</div>
                    <div>{invoice.amount}</div>
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
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Form slider */}
        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div className="relative w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] md:max-h-[90vh]">
              {isSaving && (
                <div className="absolute top-0 left-0 w-full h-[110vh] bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-50">
                  <ScaleLoader color="#1E93AB" size={60} />
                </div>
              )}
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  Edit Pending Orders
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={() => setIsSliderOpen(false)}
                >
                  ×
                </button>
              </div>

              {/* ✅ Form (same styling preserved) */}
              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 border p-4 rounded-lg">
                  <div className="flex gap-3">
                    <label className="block text-gray-700 font-medium">
                      Invoice No. :
                    </label>
                    <p>{invoiceId}</p>
                  </div>

                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Invoice Date :
                    </label>
                    <p>{formDate(invoiceDate)}</p>
                  </div>

                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Customer :
                    </label>
                    <p>{customer}</p>
                  </div>

                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Salesman :
                    </label>
                    <p>{salesman}</p>
                  </div>

                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Previous Balance :
                    </label>
                    <p>{previousBalance}</p>
                  </div>

                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Delivery Date :
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    />
                  </div>
                </div>

                {/* ✅ Items table */}
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

                    {items.map((item, i) => (
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
                        <div className="px-4 py-2 border-r border-gray-300">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => {
                              const rate = parseFloat(e.target.value) || 0;
                              setItems((prev) =>
                                prev.map((it, idx) =>
                                  idx === i
                                    ? { ...it, rate, total: rate * it.qty }
                                    : it
                                )
                              );
                            }}
                            className="w-20 p-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-newPrimary"
                          />
                        </div>
                        <div className="px-4 py-2 border-r border-gray-300">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => {
                              const newQty = parseFloat(e.target.value) || 1;

                              setItems((prev) =>
                                prev.map((it, idx) => {
                                  if (idx === i) {
                                    // 🧠 Store original qty (first time only)
                                    if (!it.originalQty)
                                      it.originalQty = it.qty;

                                    // 🧩 Allow only between 1 and originalQty
                                    const updatedQty = Math.min(
                                      Math.max(newQty, 1),
                                      it.originalQty
                                    );

                                    return {
                                      ...it,
                                      qty: updatedQty,
                                      total: updatedQty * it.rate,
                                    };
                                  }
                                  return it;
                                })
                              );
                            }}
                            className="w-20 p-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-newPrimary"
                          />
                        </div>
                        <div className="px-4 py-2">{item.total}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ✅ Totals */}
                <div className="flex flex-col w-full items-end gap-4 mt-4">
                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Total Price
                    </label>
                    <input
                      type="number"
                      value={totalPrice}
                      disabled
                      readOnly
                      className="w-[200px]  h-[40px] p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Discount Amount
                    </label>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(e.target.value)}
                      className="w-[200px]  h-[40px] p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex gap-2">
                    <label className="block text-gray-700 font-medium mb-2">
                      Receivable
                    </label>
                    <input
                      type="number"
                      value={receivable}
                      disabled
                      readOnly
                      className="w-[200px]  h-[40px] p-3 border border-gray-300 rounded-md"
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
                      className="w-[200px]  h-[40px] p-3 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="flex w-full  ">
                    <div className="flex-1 gap-2 flex min-w-0">
                      <label className="block text-gray-700 font-medium mb-1">
                        Aging Date
                      </label>
                      <input
                        type="date"
                        value={receivingDate}
                        disabled
                        readOnly
                        className="w-[200px] h-[40px] px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      />
                    </div>

                    <div className="flex-1 gap-2 relative left-28 flex min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">
                        Balance
                      </label>
                      <input
                        type="number"
                        value={balance}
                        disabled
                        readOnly
                        className="w-[200px] h-[40px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Balance amount"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors"
                >
                  Update Pending Orders
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

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
