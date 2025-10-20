import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { SquarePen, Trash2 } from "lucide-react";
import gsap from "gsap";
import Swal from "sweetalert2";
import axios from "axios";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";

const orderStatuses = ["Pending", "Processing", "Delivered", "Cancelled"];

const CustomerwiseOrders = () => {
  const [orderList, setOrderList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // form fields
  const [customer, setCustomer] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [status, setStatus] = useState("Pending");
  const [remarks, setRemarks] = useState("");

  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/orders`;

  // GSAP Animation
  useEffect(() => {
    if (isSliderOpen) {
      if (sliderRef.current) sliderRef.current.style.display = "block";
      gsap.fromTo(
        sliderRef.current,
        { scale: 0.7, opacity: 0, y: -50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    } else {
      gsap.to(sliderRef.current, {
        scale: 0.7,
        opacity: 0,
        y: -50,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          if (sliderRef.current) sliderRef.current.style.display = "none";
        },
      });
    }
  }, [isSliderOpen]);

  // Fetch Customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/customers`
      );
      setCustomerList(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setOrderList(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchOrders();
  }, [fetchCustomers, fetchOrders]);

  // Validation
  const validateForm = () => {
    if (!customer) return toast.error("Please select a customer"), false;
    if (!orderNo.trim()) return toast.error("Enter Order Number"), false;
    if (!orderDate) return toast.error("Select Order Date"), false;
    if (!totalAmount || isNaN(totalAmount))
      return toast.error("Enter valid Total Amount"), false;
    return true;
  };

  // Save / Update Order
  const handleSave = async () => {
    if (!validateForm()) return;
    const data = {
      customer,
      orderNo,
      orderDate,
      totalAmount,
      status,
      remarks,
    };

    const headers = {
      Authorization: `Bearer ${userInfo?.token}`,
      "Content-Type": "application/json",
    };

    try {
      if (isEdit && editId) {
        await axios.put(`${API_URL}/${editId}`, data, { headers });
        toast.success("Order updated successfully");
      } else {
        await axios.post(API_URL, data, { headers });
        toast.success("Order added successfully");
      }
      fetchOrders();
      resetForm();
      setIsSliderOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (order) => {
    setIsEdit(true);
    setEditId(order._id);
    setCustomer(order.customer);
    setOrderNo(order.orderNo);
    setOrderDate(order.orderDate);
    setTotalAmount(order.totalAmount);
    setStatus(order.status);
    setRemarks(order.remarks || "");
    setIsSliderOpen(true);
  };

  const handleDelete = async (id) => {
    const swal = Swal.mixin({
      customClass: {
        actions: "space-x-2",
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600",
      },
      buttonsStyling: false,
    });

    swal
      .fire({
        title: "Are you sure?",
        text: "You want to delete this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(`${API_URL}/${id}`, {
              headers: { Authorization: `Bearer ${userInfo?.token}` },
            });
            setOrderList(orderList.filter((o) => o._id !== id));
            swal.fire("Deleted!", "Order deleted successfully", "success");
          } catch {
            swal.fire("Error!", "Failed to delete order", "error");
          }
        }
      });
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditId(null);
    setCustomer("");
    setOrderNo("");
    setOrderDate("");
    setTotalAmount("");
    setStatus("Pending");
    setRemarks("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <CommanHeader />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">
            Customerwise Orders
          </h1>
          <p className="text-gray-500 text-sm">
            Manage customer orders and view details
          </p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/90"
          onClick={() => {
            resetForm();
            setIsSliderOpen(true);
          }}
        >
          + Add Order
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="hidden lg:grid grid-cols-[60px_1.5fr_1fr_1fr_1fr_1fr_1fr] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
              <div>SR#</div>
              <div>Customer Name</div>
              <div>Order No</div>
              <div>Order Date</div>
              <div>Total Amount</div>
              <div>Status</div>
              {userInfo?.isAdmin && <div className="text-right">Actions</div>}
            </div>

            <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {loading ? (
                <TableSkeleton rows={5} cols={7} />
              ) : orderList.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-white">
                  No orders found.
                </div>
              ) : (
                orderList.map((o, index) => (
                  <div
                    key={o._id}
                    className="hidden lg:grid grid-cols-[60px_1.5fr_1fr_1fr_1fr_1fr_1fr] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50"
                  >
                    <div>{index + 1}</div>
                    <div>{o.customerName || o.customer}</div>
                    <div>{o.orderNo}</div>
                    <div>{o.orderDate}</div>
                    <div>{o.totalAmount}</div>
                    <div>{o.status}</div>
                    {userInfo?.isAdmin && (
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(o)}
                          className="text-blue-600"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(o._id)}
                          className="text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
          <div
            ref={sliderRef}
            className="w-full md:w-[550px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-newPrimary">
                {isEdit ? "Update Order" : "Add New Order"}
              </h2>
              <button
                className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                onClick={() => setIsSliderOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* Customer */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Customer <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                >
                  <option value="">Select Customer</option>
                  {customerList.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Info */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Order No.
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={orderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    placeholder="e.g. ORD-00123"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Order Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Amount + Status */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    placeholder="e.g. 25000"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Status
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {orderStatuses.map((s, i) => (
                      <option key={i}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Remarks
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Additional notes"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>

              <button
                className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 w-full"
                onClick={handleSave}
              >
                Save Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerwiseOrders;
