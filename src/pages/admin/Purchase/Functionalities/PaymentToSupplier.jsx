import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2, CheckCircle, XCircle, X } from "lucide-react";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";
import Swal from "sweetalert2";
import { api } from "../../../../context/ApiService";

const PaymentToSupplier = () => {
  const [deliveryChallans, setDeliveryChallans] = useState([]);

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dcNo, setDcNo] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);

  const [date, setDate] = useState("");
  const [product, setProduct] = useState("");
  const [rate, setRate] = useState("");
  const [inStock, setInStock] = useState("");
  const [bookingOrders, setBookingOrders] = useState([]);
  const [specification, setSpecification] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [qty, setQty] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingVoucher, setEditingVoucher] = useState(null); // Fixed: was editingReceipt
  const [cashData, setCashData] = useState({
    receiptId: "",
    date: "",
    customer: "", // store customer _id (not name)
    amountReceived: 0,
    newBalance: 0,
    remarks: "",
  });
  const [nextReceiptId, setNextReceiptId] = useState("001");
  const [customersCash, setCustomersCash] = useState([]);

  const handleAddItem = () => {
    if (!product) return;

    // Update availableProducts table visually
    const updatedProducts = availableProducts.map((p) =>
      p.name === product ? { ...p, deliverQty: qty, total: qty * p.rate } : p
    );
    setAvailableProducts(updatedProducts);

    // Update or add the modified product in itemsList
    const existingIndex = itemsList.findIndex((i) => i.name === product);
    const updatedItem = {
      name: product,
      specification,
      qty,
      rate,
      total: qty * rate,
    };

    let newList = [];
    if (existingIndex !== -1) {
      newList = [...itemsList];
      newList[existingIndex] = updatedItem;
    } else {
      newList = [...itemsList, updatedItem];
    }

    setItemsList(newList);

    // ✅ NEW: Ensure all updated products are in itemsList before submit
    const syncedList = updatedProducts
      .filter((p) => p.deliverQty > 0)
      .map((p) => ({
        name: p.name,
        rate: p.rate,
        qty: p.deliverQty,
        total: p.total,
      }));

    setItemsList(syncedList);

    // Reset fields
    setProduct("");

    setQty(1);
    setRate("");
    setTotal(0);
  };

  const handleRemoveItem = (idx) => {
    setItemsList(itemsList.filter((_, i) => i !== idx));
  };

  const [orderNo, setOrderNo] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderDetails, setOrderDetails] = useState({
    customer: "",
    person: "",
    phone: "",
    address: "",
    orderType: "",
    mode: "",
    deliveryAddress: "",
    deliveryDate: "",
    totalWeight: "",
  });

  const [remarks, setRemarks] = useState("");
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [status, setStatus] = useState("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingChallan, setEditingChallan] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("orderDetails");
  const [nextDcNo, setNextDcNo] = useState("003");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // Simulate fetching delivery challans
  const headers = {
    Authorization: `Bearer ${userInfo?.token}`,
  };
  // fetch delivery challans
  const fetchDeliveryChallans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/delivery-challan");
      setDeliveryChallans(response.data);
      console.log({ deliveryChallans: response.data });
    } catch (error) {
      console.error("Failed to fetch booking orders", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchDeliveryChallans();
  }, [fetchDeliveryChallans]);

  // fetch booking orders
  const fetchBookingOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/booking-order/DC-Order");
      setBookingOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch booking orders", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchBookingOrders();
  }, [fetchBookingOrders]);

  // Delivery challan search
  // 🔍 Delivery challan search (same logic as booking order search)
  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchDeliveryChallans(); // only when cleared
      return;
    }

    const delayDebounce = setTimeout(() => {
      setLoading(true);
      const filtered = deliveryChallans.filter((challan) =>
        challan?.dcNo?.toUpperCase().includes(searchTerm.toUpperCase())
      );
      setDeliveryChallans(filtered);
      setLoading(false);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchDeliveryChallans]);

  // Generate next DC No
  useEffect(() => {
    if (deliveryChallans.length > 0) {
      const maxNo = Math.max(
        ...deliveryChallans.map((c) => {
          const match = c.dcNo?.match(/DC-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextDcNo((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextDcNo("001");
    }
  }, [deliveryChallans]);

  // Reset form fields
  const resetForm = () => {
    setDcNo("");
    setDate("");
    setOrderNo("");
    setOrderDate("");
    setOrderDetails({
      customer: "",
      person: "",
      phone: "",
      address: "",
      orderType: "",
      mode: "",
      deliveryAddress: "",
      deliveryDate: "",
      totalWeight: "",
    });

    setRemarks("");
    setApprovalRemarks("");
    setStatus("Pending");
    setEditingChallan(null);
    setErrors({});
    setItemsList([]);
    setActiveTab("orderDetails");
    setIsSliderOpen(false);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // Basic fields

    if (!orderNo?.trim()) newErrors.orderNo = "Booking Order is required";
    if (!orderDate?.trim()) newErrors.orderDate = "Order Date is required";

    // Order details (auto-filled)
    if (!orderDetails.customer?.trim())
      newErrors.customer = "Customer is required";
    if (!orderDetails.phone?.trim()) newErrors.phone = "Phone is required";
    if (!orderDetails.address?.trim())
      newErrors.address = "Address is required";
    if (!orderDetails.deliveryAddress?.trim())
      newErrors.deliveryAddress = "Delivery Address is required";

    // Remarks optional — no strict check
    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handlers for form and table actions
  const handleAddChallan = () => {
    resetForm();
    setDate(new Date().toISOString().split("T")[0]);
    setIsSliderOpen(true);
  };

  // ✅ Helper function to convert "16-Oct-2025" → "2025-10-16"
  const formatToISODate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("T")) return dateStr.split("T")[0]; // already ISO

    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [day, mon, year] = parts;
      return `${year}-${months[mon]}-${day.padStart(2, "0")}`;
    }
    return "";
  };

  const handleEditClick = (challan) => {
    setEditingChallan(challan);
    console.log({ challan });

    // ✅ DC basic info
    setDcNo(challan.dcNo || "");
    setDate(formatToISODate(challan.dcDate));

    // ✅ Booking order info
    setOrderNo(challan.bookingOrder?._id || "");
    setOrderDate(formatToISODate(challan.bookingOrder?.orderDate));

    // ✅ Customer and delivery details
    setOrderDetails({
      customer: challan.bookingOrder?.customer?.customerName || "",
      phone: challan.bookingOrder?.customer?.phoneNumber || "",
      address: challan.bookingOrder?.customer?.address || "",
      deliveryAddress: challan.bookingOrder?.deliveryAddress || "",
    });

    // ✅ Source of product list (fallback if bookingOrder.products missing)
    const productSource =
      challan.bookingOrder?.products?.length > 0
        ? challan.bookingOrder.products
        : challan.products || [];

    // ✅ Format products for editable table
    const formattedProducts = productSource.map((p) => {
      const qty = p.qty || p.orderedQty || 0;
      const total = p.total || 0;
      const rate =
        p.rate && p.rate > 0
          ? p.rate
          : p.invoiceRate && p.invoiceRate > 0
          ? p.invoiceRate
          : qty > 0
          ? total / qty
          : 0;

      return {
        name: p.name,
        rate,
        orderedQty: qty,
        deliverQty: p.qty || qty,
        remainingQty: p.remainingQty || 0,
        total,
        details: p.details || "",
      };
    });

    // ✅ Load into state for editable product table
    setAvailableProducts(formattedProducts);

    // ✅ Also populate itemsList for submit payload
    setItemsList(
      challan.products?.map((item) => ({
        name: item.name,
        qty: item.qty,
        rate: item.invoiceRate || item.rate || 0,
        total: item.total,
        specification: item.specification || "",
      })) || []
    );

    // ✅ Fill current product fields (auto-select first one for editing)
    if (formattedProducts.length > 0) {
      const firstProd = formattedProducts[0];
      setProduct(firstProd.name);
      setRate(firstProd.rate);
      setQty(firstProd.deliverQty || firstProd.orderedQty);
      setSpecification(firstProd.details || "");
      setTotal(firstProd.total || firstProd.rate * (firstProd.deliverQty || 1));
    } else {
      setProduct("");
      setRate("");
      setQty(1);
      setSpecification("");
      setTotal(0);
    }

    // ✅ Other details
    setRemarks(challan.remarks || "");
    setApprovalRemarks(challan.approvalRemarks || "");
    setStatus(challan.status || "Pending");
    setErrors({});
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateForm()) return;

    // ✅ Prepare payload for backend
    const finalProducts =
      itemsList.length > 0
        ? itemsList
        : availableProducts.map((p) => ({
            name: p.name,
            rate: p.rate || 0,
            qty: p.deliverQty ?? p.orderedQty ?? p.qty ?? 0,
            total: (p.rate || 0) * (p.deliverQty ?? p.orderedQty ?? p.qty ?? 0),
          }));

    // ✅ Prepare payload for backend
    const payload = {
      dcNo: editingChallan ? dcNo : `DC-${nextDcNo}`,
      dcDate: date,
      bookingOrder: orderNo, // Booking order ID
      products: finalProducts,
      remarks: remarks.trim(),
      status,
    };

    try {
      if (editingChallan) {
        await api.put(`/delivery-challan/${editingChallan._id}`, payload, {
          headers,
        });
        Swal.fire(
          "Updated!",
          "Delivery Challan updated successfully.",
          "success"
        );
      } else {
        await api.post("/delivery-challan", payload, { headers });
        Swal.fire("Added!", "Delivery Challan added successfully.", "success");
      }

      fetchDeliveryChallans();
      resetForm();
    } catch (error) {
      console.error("Error saving delivery challan:", error);
      Swal.fire("Error!", "Failed to save delivery challan.", "error");
    }
  };

  const handleDelete = (id) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "space-x-2",
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300",
      },
      buttonsStyling: false,
    });

    swalWithTailwindButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            setLoading(true);
            await api.delete(`/delivery-challan/${id}`, { headers });
            setDeliveryChallans((prev) => prev.filter((c) => c._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Delivery Challan deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete delivery challan.",
              "error"
            );
          } finally {
            setLoading(false);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Delivery Challan is safe 🙂",
            "error"
          );
        }
      });
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = deliveryChallans.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(deliveryChallans.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // 🟢 Handle Product Selection
  const handleProductSelect = (selectedName) => {
    setProduct(selectedName);

    const selectedProd = availableProducts.find((p) => p.name === selectedName);
    console.log("Selected product:", selectedProd);

    if (selectedProd) {
      setTimeout(() => {
        setSpecification(selectedProd.details || "");

        const initialQty = selectedProd.orderedQty || 1;

        // 🧮 calculate base total from orderedQty and total
        const baseTotal = selectedProd.total || 0;

        // store orderedQty and total-based calc
        setQty(initialQty);
        setTotal(baseTotal);
        setRate(selectedProd.rate);
      }, 300);
    } else {
      setSpecification("");
      setRate("");
      setInStock("");
      setQty(1);
      setTotal(0);
    }
  };
  console.log({ deliveryChallans, total });

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Supplier Payment Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter DC No eg: DC-001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            />
            <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
              onClick={handleAddChallan}
            >
              + Add Payment
            </button>
          </div>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[900px]">
            <div className="min-w-[1400px]">
              <div className="hidden lg:grid grid-cols-[0.4fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>SR</div>
                <div>DC No</div>
                <div>Date</div>
                <div>Order No</div>
                <div>Customer</div>
                <div>Delivery Date</div>
                <div>Total Amount</div>
                <div>Delivery Address</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100">
                {loading ? (
                  <TableSkeleton
                    rows={currentRecords.length || 5}
                    cols={10}
                    className="lg:grid-cols-[0.4fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]"
                  />
                ) : currentRecords.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No delivery challans found.
                  </div>
                ) : (
                  currentRecords.map((challan, index) => (
                    <div
                      key={challan._id}
                      className="grid grid-cols-1 lg:grid-cols-[0.4fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="text-gray-600">
                        {indexOfFirstRecord + index + 1}
                      </div>
                      {/* DC No */}
                      <div className="text-gray-600">{challan.dcNo}</div>

                      {/* DC Date */}
                      <div className="text-gray-600">
                        {new Date(challan.dcDate).toLocaleDateString()}
                      </div>

                      {/* Order No */}
                      <div className="text-gray-600">
                        {challan.bookingOrder?.orderNo || "-"}
                      </div>

                      {/* Customer */}
                      <div className="text-gray-600">
                        {challan.bookingOrder?.customer?.customerName || "-"}
                      </div>

                      {/* Delivery Date */}
                      <div className="text-gray-600">
                        {new Date(
                          challan.bookingOrder?.deliveryDate
                        ).toLocaleDateString()}
                      </div>

                      {/* Total Amount */}
                      <div className="text-gray-600">
                        {challan.products
                          ?.reduce((sum, item) => sum + (item.total || 0), 0)
                          .toLocaleString()}
                      </div>

                      {/* Delivery Address */}
                      <div className="text-gray-600">
                        {challan.bookingOrder?.deliveryAddress || "-"}
                      </div>

                      {/* Status */}
                      <div
                        className={`font-semibold ${
                          challan.status === "Pending"
                            ? "text-yellow-600"
                            : challan.status === "Approved"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {challan.status}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 justify-start">
                        {challan.status !== "Dispatched" && (
                          <>
                            <button
                              onClick={() => handleEditClick(challan)}
                              className="py-1 text-sm rounded text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <SquarePen size={18} />
                            </button>

                            <button
                              onClick={() => handleDelete(challan._id)}
                              className="py-1 text-sm rounded text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between my-4 px-10">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstRecord + 1} to{" "}
                {Math.min(indexOfLastRecord, deliveryChallans.length)} of{" "}
                {deliveryChallans.length} records
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-newPrimary text-white hover:bg-newPrimary/80"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-newPrimary text-white hover:bg-newPrimary/80"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingVoucher
                    ? "Update Payment Receipt Voucher"
                    : "Add a New Payment Receipt Voucher"}
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                {/* Cash Form */}

                <div className="space-y-4">
                  {/* Date & Receipt ID */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={cashData.date}
                        onChange={(e) =>
                          setCashData({ ...cashData, date: e.target.value })
                        }
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Receipt ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={
                          editingVoucher
                            ? editingVoucher.receiptId
                            : nextReceiptId
                        }
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Customer & Balance */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Customer Name <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={cashData.customer}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedCustomer = customers.find(
                            (c) => c._id === selectedId
                          );

                          setCashData({
                            ...cashData,
                            customer: selectedCustomer?._id || "",
                            balance: selectedCustomer?.balance || 0, // ✅ store actual balance
                            newBalance: selectedCustomer?.balance || 0,
                            amountReceived: 0, // reset when new customer selected
                          });
                        }}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Customer</option>
                        {customersCash.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.customerName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Balance field */}
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Balance
                      </label>
                      <input
                        type="number"
                        value={cashData.balance}
                        readOnly
                        className="w-full p-3 border rounded-md bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Amount Received & New Balance */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        Amount Received <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={cashData.amountReceived}
                        onChange={(e) => {
                          const amount = parseFloat(e.target.value) || 0;
                          const newBalance = cashData.balance - amount; // ✅ live calculation
                          setCashData({
                            ...cashData,
                            amountReceived: amount,
                            newBalance,
                          });
                        }}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-700 font-medium mb-2">
                        New Balance
                      </label>
                      <input
                        type="text"
                        value={Math.max(0, Math.round(cashData.newBalance))} // prevent negative display
                        readOnly
                        className={`w-full p-3 border rounded-md ${
                          cashData.newBalance < 0
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100"
                        }`}
                      />
                    </div>
                  </div>
                  {/* Remarks Field */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Remarks
                    </label>
                    <textarea
                      value={cashData.remarks}
                      onChange={(e) =>
                        setCashData({
                          ...cashData,
                          remarks: e.target.value,
                        })
                      }
                      placeholder="Enter any remarks or notes"
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                >
                  Save Payment
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

export default PaymentToSupplier;
