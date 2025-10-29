import React, { useState, useEffect, useCallback } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";
import Swal from "sweetalert2";
import { api } from "../../../../context/ApiService";
import { Eye } from "lucide-react";
import ViewModal from "../../../../helper/ViewModel";
import { ScaleLoader } from "react-spinners";
import toast from "react-hot-toast";

const DailySalesReport = () => {
  const [isView, setIsView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [salesman, setSalesman] = useState([]);
  const [salesmanList, setSalesmanList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [selectedOrders, setSelectedOrders] = useState("");
  const [PendingOrdersList, setPeningOrdersList] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentType, setPaymentType] = useState("Cash");
  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [dueAmount, setDueAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [enterAmount, setEnterAmount] = useState("");
  const [newBalance, setNewBalance] = useState(0);
  const [filteredInvoices, setFilteredInvoices] = useState([]);


  const staticInvoices = [
    { _id: "INV-001", customerId: "1", dueAmount: 30000 },
    { _id: "INV-002", customerId: "1", dueAmount: 15000 },
    { _id: "INV-003", customerId: "2", dueAmount: 44000 },
    { _id: "INV-004", customerId: "2", dueAmount: 25000 },
    { _id: "INV-005", customerId: "3", dueAmount: -20000 },
    { _id: "INV-006", customerId: "4", dueAmount: 37000 },
    { _id: "INV-007", customerId: "5", dueAmount: 156000 },
  ];

  // Handle individual checkbox change
  const handleInvoiceCheckboxChange = (invoiceId, isChecked) => {
    if (isChecked) {
      setSelectedInvoices((prev) => [...prev, invoiceId]);
    } else {
      setSelectedInvoices((prev) => prev.filter((id) => id !== invoiceId));
    }
  };

  // Select all/deselect all functionality
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allInvoiceIds = filteredInvoices.map((inv) => inv.orderId);
      setSelectedInvoices(allInvoiceIds);
    } else {
      setSelectedInvoices([]);
    }
  };

  // Remove individual invoice from selection
  const removeInvoice = (invoiceId) => {
    setSelectedInvoices((prev) => prev.filter((id) => id !== invoiceId));
  };

  // Clear all selected invoices
  const clearAllInvoices = () => {
    setSelectedInvoices([]);
  };

  // Calculate totals whenever selectedInvoices changes
  useEffect(() => {
    const totalDue = selectedInvoices.reduce((sum, invoiceId) => {
      const invoice = filteredInvoices.find((inv) => inv.orderId === invoiceId);
      return sum + (invoice ? invoice.totalAmount : 0);
    }, 0);

    setDueAmount(totalDue);
  }, [selectedInvoices]);

  // Fetching customer List
  const fetchCustomersBySalesman = async (salesmanId) => {
    try {
      setLoading(true);
      const response = await api.get(`/customers/isPending/${salesmanId}`);
      setCustomersList(response.data || []); // ✅ update customer dropdown
    } catch (error) {
      console.error("❌ Failed to fetch customers by salesman:", error);
      toast.error("Failed to load customers for this salesman");
    } finally {
      setLoading(false);
    }
  };
  console.log({ customersList });

  // ✅ Fetch Orders for Selected Pending Customer
  const fetchOrdersByCustomer = async (customerId) => {
    try {
      setLoading(true);
      const response = await api.get(`/order-taker/pending/${customerId}`);
      setFilteredInvoices(response.data || []); // populate invoice list dynamically
    } catch (error) {
      console.error("❌ Failed to fetch orders by pending customer:", error);
      toast.error("Failed to load pending orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      fetchOrdersByCustomer(selectedCustomer);
    } else {
      setFilteredInvoices([]);
    }
  }, [selectedCustomer]);

  // ✅ Update balance when customer is selected
useEffect(() => {
  if (selectedCustomer) {
    const foundCustomer = customersList.find(
      (c) => c._id === selectedCustomer
    );
    console.log("✅ Found Customer:", foundCustomer); // check in console
    setBalance(foundCustomer?.salesBalance);
  } else {
    setBalance(0);
  }
}, [selectedCustomer, customersList]);


  console.log({ filteredInvoices });

  // Fetching Salesman List
  const fetchSalesman = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/employees/reports");
      setSalesman(response);
    } catch (error) {
      console.error("Failed to fetch salesman list", error);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  }, []);

  useEffect(() => {
    fetchSalesman();
  }, [fetchSalesman]);

  // Fetch Pening Orders List
  const fetchPendingOrdersList = useCallback(async () => {
    if (!selectedSalesman) return;
    try {
      setLoading(true);
      const response = await api.get(
        `/order-taker/salesman/${selectedSalesman}`
      );
      setPeningOrdersList(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch salesman list", error);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  }, [selectedSalesman]);

  console.log({ PendingOrdersList });

  // ✅ Fetch Pending Orders Data (Sales Items, Payment Received, Recoveries)
  const fetchPendingOrderData = useCallback(async () => {
    if (!selectedSalesman) return;
    try {
      setLoading(true);
      const response = await api.get(
        `/order-taker/pending/salesman/${selectedSalesman}`
      );
      setSalesmanList({
        salesItems: response.salesItems || [],
        paymentReceived: response.paymentReceived || [],
        recoveries: response.recoveries || [],
      });
    } catch (error) {
      console.error("❌ Failed to fetch pending order data:", error);
      toast.error("Failed to load pending order data");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  }, [selectedSalesman]);

  useEffect(() => {
    if (selectedSalesman) {
      fetchPendingOrdersList(); // for dropdown
      fetchPendingOrderData(); // for table data
    }
  }, [selectedSalesman, fetchPendingOrdersList, fetchPendingOrderData]);

  // ✅ Fetch Table Data Based on Selected Order
  const fetchOrderBasedData = useCallback(async () => {
    console.log({ selectedOrders });

    if (!selectedOrders) return;
    try {
      setLoading(true);
      const response = await api.get(
        `/order-taker/pending/order/${selectedOrders}`
      );
      console.log({ response });
      setSalesmanList({
        salesItems: response.salesItems || [],
        paymentReceived: response.paymentReceived || [],
        recoveries: response.recoveries || [],
      });
    } catch (error) {
      console.error("❌ Failed to fetch order-based data:", error);
      toast.error("Failed to load order data");
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  }, [selectedOrders]);

  useEffect(() => {
    if (selectedOrders) {
      fetchOrderBasedData();
    }
  }, [selectedOrders, fetchOrderBasedData]);

  // 🔄 Refetch Pending Orders when date changes
  useEffect(() => {
    if (selectedSalesman && selectedDate) {
      const fetchDatewisePendingOrders = async () => {
        try {
          setLoading(true);
          const response = await api.get(
            `/order-taker/salesman/${selectedSalesman}?date=${selectedDate}`
          );
          setPeningOrdersList(response?.data || []);
        } catch (error) {
          console.error("❌ Failed to fetch datewise pending orders:", error);
        } finally {
          setTimeout(() => setLoading(false), 2000);
        }
      };
      fetchDatewisePendingOrders();
    }
  }, [selectedSalesman, selectedDate]);

  // 🔄 Fetch All Pending Orders (with Sales Items & Payments) when date changes
  useEffect(() => {
    if (selectedSalesman && selectedDate) {
      const fetchPendingOrdersWithDate = async () => {
        try {
          setLoading(true);
          const response = await api.get(
            `/order-taker/pending/salesman/${selectedSalesman}?date=${selectedDate}`
          );
          setSalesmanList({
            salesItems: response.salesItems || [],
            paymentReceived: response.paymentReceived || [],
            recoveries: response.recoveries || [],
          });
        } catch (error) {
          console.error(
            "❌ Failed to fetch all pending orders with date:",
            error
          );
        } finally {
          setTimeout(() => setLoading(false), 2000);
        }
      };
      fetchPendingOrdersWithDate();
    }
  }, [selectedSalesman, selectedDate]);

  // Reset invoices when customer changes
  useEffect(() => {
    setSelectedInvoices([]);
    setDueAmount(0);
    setEnterAmount("");
    setNewBalance(0);
  }, [selectedCustomer]);

  useEffect(() => {
    const amount = parseFloat(enterAmount) || 0;
    if (paymentType === "Cash") {
      setNewBalance(balance - amount);
    } else if (paymentType === "Recovery") {
      setNewBalance(balance - amount);
    }
  }, [enterAmount, balance, paymentType]);

  const handleSaveReceivable = async (e) => {
    e.preventDefault();

    if (selectedInvoices.length === 0) {
      toast.error("Please select at least one invoice");
      return;
    }

    if (!enterAmount || parseFloat(enterAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSaving(true);
    try {
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: `Receivable saved for ${selectedInvoices.length} invoice(s) successfully.`,
        confirmButtonColor: "#3085d6",
      });
      setIsSliderOpen(false);
      setSelectedCustomer("");
      setSelectedInvoices([]);
      setDueAmount(0);
      setBalance(0);
      setEnterAmount("");
      setNewBalance(0);
    } catch (error) {
      console.error("Error saving receivable:", error);
      toast.error("Failed to save receivable");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setIsSliderOpen(false);
    setSelectedCustomer("");
    setSelectedInvoices([]);
    setDueAmount(0);
    setBalance(0);
    setEnterAmount("");
    setNewBalance(0);
    setPaymentType("Cash");
  };
  console.log({ salesmanList });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentSalesItems =
    salesmanList?.salesItems?.slice(indexOfFirstRecord, indexOfLastRecord) ||
    [];
  const currentPaymentReceived =
    salesmanList?.paymentReceived?.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    ) || [];
  const currentRecoveries =
    salesmanList?.recoveries?.slice(indexOfFirstRecord, indexOfLastRecord) ||
    [];
  const totalPages = Math.ceil(
    (salesmanList?.salesItems?.length || 0) / recordsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSalesman]);

  const allSelected =
    selectedCustomer &&
    filteredInvoices.length > 0 &&
    selectedInvoices.length === filteredInvoices.length;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-newPrimary">
            Daily Sales Report
          </h1>
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
            onClick={() => {
              if (!selectedSalesman) {
                toast.error("Please select a salesman first");
                return;
              }
              setIsSliderOpen(true);
              fetchCustomersBySalesman(selectedSalesman); // ✅ new function call
            }}
          >
            + Add Receivable
          </button>
        </div>
        <div className="flex justify-start gap-[40rem] w-full mt-4">
          {/* ===== Left Section ===== */}
          <div className="flex flex-col space-y-2">
            {/* Salesman Field */}
            <div className="flex items-center gap-6">
              <label className="text-gray-700 font-medium w-24">
                Salesman <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSalesman}
                onChange={(e) => setSelectedSalesman(e.target.value)}
                className="w-[250px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2  focus:ring-newPrimary"
              >
                <option value="">Select Salesman</option>
                {salesman?.map((cust) => (
                  <option key={cust._id} value={cust._id}>
                    {cust.employeeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Field */}
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
          </div>

          {/* ===== Right Section ===== */}
          <div className="flex flex-col justify-start">
            <div className="flex items-center gap-6">
              <label className="text-gray-700 font-medium w-24">
                Orders <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedOrders}
                onChange={(e) => setSelectedOrders(e.target.value)}
                className="w-[250px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
              >
                <option value="">Select Orders</option>
                {PendingOrdersList?.map((order) => (
                  <option key={order._id} value={order.orderId}>
                    {order.orderId}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-0 mt-6">
          {selectedSalesman && (
            <div>
              {/* Sales Items Table */}
              <div className="rounded-xl shadow border border-gray-200 overflow-hidden mb-6">
                <div className="overflow-y-auto lg:overflow-x-auto max-h-[300px]">
                  <div className="min-w-full custom-scrollbar">
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                      <div>Items</div>
                      <div>Rate</div>
                      <div>Qty</div>
                      <div>Total</div>
                    </div>
                    <div className="flex flex-col divide-y divide-gray-100">
                      {loading ? (
                        <TableSkeleton
                          rows={currentSalesItems.length || 5}
                          cols={4}
                        />
                      ) : currentSalesItems.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 bg-white">
                          No records found.
                        </div>
                      ) : (
                        <>
                          {currentSalesItems.map((item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                            >
                              <div>{item?.itemName || "-"}</div>
                              <div>{item?.rate || "-"}</div>
                              <div>{item?.qty || "-"}</div>
                              <div>{item?.total || "-"}</div>
                            </div>
                          ))}
                          {/* Total Row with Colors */}
                          <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-700 whitespace-nowrap">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div className="text-blue-800">
                              Total:{" "}
                              {currentSalesItems
                                .reduce((sum, item) => sum + item.total, 0)
                                .toLocaleString()}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Received Table */}
              <div className="rounded-xl shadow border border-gray-200 overflow-hidden mb-6">
                <div className="overflow-y-auto lg:overflow-x-auto max-h-[300px]">
                  <div className="min-w-full custom-scrollbar">
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                      <div>Customer</div>
                      <div>Total</div>
                      <div>Received</div>
                      <div>Balance</div>
                    </div>
                    <div className="flex flex-col divide-y divide-gray-100">
                      {loading ? (
                        <TableSkeleton
                          rows={currentPaymentReceived.length || 5}
                          cols={4}
                        />
                      ) : currentPaymentReceived.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 bg-white">
                          No records found.
                        </div>
                      ) : (
                        <>
                          {currentPaymentReceived.map((item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                            >
                              <div>{item?.customerName}</div>
                              <div>{item?.total || "-"}</div>
                              <div>{item?.received}</div>
                              <div
                                className={
                                  item.balance < 0
                                    ? "text-red-600"
                                    : "text-gray-700"
                                }
                              >
                                {item.balance || "-"}
                              </div>
                            </div>
                          ))}
                          {/* Total Row with Colors */}
                          <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-700 whitespace-nowrap">
                            <div></div>
                            <div className="text-blue-600">
                              Total:{" "}
                              {currentPaymentReceived
                                .reduce((sum, item) => sum + item.total, 0)
                                .toLocaleString()}
                            </div>
                            <div className="text-green-600">
                              Total Rec:{" "}
                              {currentPaymentReceived
                                .reduce((sum, item) => sum + item.received, 0)
                                .toLocaleString()}
                            </div>
                            <div
                              className={
                                currentPaymentReceived.reduce(
                                  (sum, item) => sum + item.balance,
                                  0
                                ) < 0
                                  ? "text-red-600"
                                  : "text-blue-800"
                              }
                            >
                              Total Bal:{" "}
                              {currentPaymentReceived
                                .reduce((sum, item) => sum + item.balance, 0)
                                .toLocaleString()}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recoveries Table */}
              <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
                <div className="overflow-y-auto lg:overflow-x-auto max-h-[300px]">
                  <div className="min-w-full custom-scrollbar">
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                      <div>Customer</div>
                      <div>Due Recovery</div>
                      <div>Sales Invoices</div>
                      <div>Recovery</div>
                    </div>
                    <div className="flex flex-col divide-y divide-gray-100">
                      {loading ? (
                        <TableSkeleton
                          rows={currentRecoveries.length || 5}
                          cols={4}
                        />
                      ) : currentRecoveries.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 bg-white">
                          No records found.
                        </div>
                      ) : (
                        <>
                          {currentRecoveries.map((item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                            >
                              <div>{item?.customerName}</div>
                              <div>{item?.dueRecovery || "-"}</div>
                              <div>{item?.invoiceNo}</div>
                              <div>{item?.recovery || "-"}</div>
                            </div>
                          ))}
                          {/* Total Row with Colors */}
                          <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-700 whitespace-nowrap">
                            <div></div>
                            <div className="text-blue-600">
                              Total Due:{" "}
                              {currentRecoveries
                                .reduce(
                                  (sum, item) => sum + item.dueRecovery,
                                  0
                                )
                                .toLocaleString()}
                            </div>
                            <div></div>
                            {/* <div className="text-green-600">
                              Total Rec:{" "}
                              {currentRecoveries
                                .reduce((sum, item) => sum + item.recovery, 0)
                                .toLocaleString() || "-"}
                            </div> */}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isView && selectedOrder && (
          <ViewModal
            type="dailySales"
            data={selectedOrder}
            onClose={() => setIsView(false)}
          />
        )}

        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div className="relative w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
              {loading && (
                <div className="absolute top-0 left-0 w-full h-full bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-50">
                  <ScaleLoader color="#1E93AB" size={60} />
                </div>
              )}
              <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  Add Receivable
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveReceivable} className="space-y-4 p-6">
                {/* Payment Type Radio Buttons */}
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Cash"
                      checked={paymentType === "Cash"}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="mr-2"
                    />
                    Cash
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Recovery"
                      checked={paymentType === "Recovery"}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="mr-2"
                    />
                    Recovery
                  </label>
                </div>

                {/* Conditional Fields */}
                {(paymentType === "Cash" || paymentType === "Recovery") && (
                  <div className="space-y-4">
                    <div className="w-[400px]">
                      <label className="block text-gray-700 mb-2">
                        Select Customer
                      </label>
                      <select
                        value={selectedCustomer}
                        onChange={(e) => setSelectedCustomer(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Customer</option>
                        {customersList?.map((cust) => (
                          <option key={cust._id} value={cust._id}>
                            {cust.customerName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Checkbox-based Invoice Selection */}
                    {selectedCustomer && (
                      <div className="w-full border rounded-md p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-gray-700 font-medium mb-2">
                            Select Invoice No. ({selectedInvoices.length}{" "}
                            selected)
                          </label>
                          {filteredInvoices.length > 0 && (
                            <label className="flex items-center text-sm text-gray-600">
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={handleSelectAll}
                                className="mr-2"
                              />
                              Select All
                            </label>
                          )}
                        </div>

                        {filteredInvoices.length === 0 ? (
                          <div className="text-center py-4 text-gray-500">
                            No invoices found for this customer.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {filteredInvoices.map((invoice, idx) => (
                              <label
                                key={idx}
                                className="flex items-center justify-between p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer"
                              >
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedInvoices.includes(
                                      invoice.orderId
                                    )}
                                    onChange={(e) =>
                                      handleInvoiceCheckboxChange(
                                        invoice.orderId,
                                        e.target.checked
                                      )
                                    }
                                    className="rounded border-gray-300 text-newPrimary focus:ring-newPrimary"
                                  />
                                  <span className="font-medium">
                                    {invoice.orderId}
                                  </span>
                                </div>
                                <span
                                  className={`font-medium ${
                                    invoice.totalAmount < 0
                                      ? "text-red-600"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {invoice.totalAmount.toLocaleString()}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Selected Invoices Display */}
                    {selectedInvoices.length > 0 && (
                      <div className="border rounded-md p-3 bg-blue-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-blue-800">
                            Selected Invoices ({selectedInvoices.length}):
                          </span>
                          <button
                            type="button"
                            onClick={clearAllInvoices}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {selectedInvoices.map((invoiceId) => {
                            const invoice = staticInvoices.find(
                              (inv) => inv._id === invoiceId
                            );
                            return invoice ? (
                              <div
                                key={invoiceId}
                                className="flex justify-between items-center bg-white p-2 rounded border"
                              >
                                <span className="font-medium">
                                  {invoice._id}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`font-medium ${
                                      invoice.dueAmount < 0
                                        ? "text-red-600"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {invoice.dueAmount.toLocaleString()}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeInvoice(invoiceId)}
                                    className="text-red-500 hover:text-red-700 text-lg"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <div className="w-1/3">
                        <label className="block text-gray-700 mb-2">
                          Total Due Amount
                        </label>
                        <input
                          type="number"
                          value={dueAmount}
                          readOnly
                          className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-gray-700 mb-2">
                          Balance
                        </label>
                        <input
                          type="text"
                          value={balance}
                          readOnly
                          className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-gray-700 mb-2">
                          Enter Amount
                        </label>
                        <input
                          type="number"
                          value={enterAmount}
                          onChange={(e) => setEnterAmount(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md"
                          max={dueAmount}
                        />
                      </div>
                    </div>
                    <div className="w-1/3">
                      <label className="block text-gray-700 mb-2">
                        New Balance
                      </label>
                      <input
                        type="number"
                        value={newBalance}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-newPrimary text-white py-3 rounded-lg hover:bg-newPrimary/80 "
                  disabled={isSaving || selectedInvoices.length === 0}
                >
                  {isSaving ? "Saving..." : `Save Receivable `}
                </button>
              </form>
            </div>
          </div>
        )}

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
    </div>
  );
};

export default DailySalesReport;
