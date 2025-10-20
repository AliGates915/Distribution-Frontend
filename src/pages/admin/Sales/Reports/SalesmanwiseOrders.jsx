import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import gsap from "gsap";
import Swal from "sweetalert2";
import axios from "axios";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";

const orderStatusOptions = ["Pending", "Completed", "Cancelled", "Processing"];

const SalesmanwiseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form fields
  const [date, setDate] = useState("");
  const [salesman, setSalesman] = useState("");
  const [customer, setCustomer] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Pending");

  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/salesman-orders`;

  // GSAP modal animation
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
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => {
          if (sliderRef.current) sliderRef.current.style.display = "none";
        },
      });
    }
  }, [isSliderOpen]);

  // Fetch data
  const fetchSalesmen = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/salesmen`
      );
      setSalesmen(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/customers`
      );
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/items`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchSalesmen();
    fetchCustomers();
    fetchItems();
    fetchOrders();
  }, [fetchSalesmen, fetchCustomers, fetchItems, fetchOrders]);

  // Validation
  const validateForm = () => {
    if (!date) return toast.error("Please select a date"), false;
    if (!salesman) return toast.error("Please select a salesman"), false;
    if (!customer) return toast.error("Please select a customer"), false;
    if (!item) return toast.error("Please select an item"), false;
    if (!quantity || Number(quantity) <= 0)
      return toast.error("Enter valid quantity"), false;
    if (!amount || Number(amount) <= 0)
      return toast.error("Enter valid amount"), false;
    return true;
  };

  // Save or Update
  const handleSave = async () => {
    if (!validateForm()) return;

    const data = { date, salesman, customer, item, quantity, amount, status };
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
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (order) => {
    setIsEdit(true);
    setEditId(order._id);
    setDate(order.date);
    setSalesman(order.salesman);
    setCustomer(order.customer);
    setItem(order.item);
    setQuantity(order.quantity);
    setAmount(order.amount);
    setStatus(order.status);
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
        text: "This order will be permanently deleted.",
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
            setOrders(orders.filter((o) => o._id !== id));
            swal.fire("Deleted!", "Order deleted successfully.", "success");
          } catch {
            swal.fire("Error!", "Failed to delete order.", "error");
          }
        }
      });
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditId(null);
    setDate("");
    setSalesman("");
    setCustomer("");
    setItem("");
    setQuantity("");
    setAmount("");
    setStatus("Pending");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <CommanHeader />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">
            Salesmanwise Orders
          </h1>
          <p className="text-gray-500 text-sm">
            Manage orders assigned to each salesman
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
            <div className="hidden lg:grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_120px] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
              <div>SR#</div>
              <div>Date</div>
              <div>Salesman</div>
              <div>Customer</div>
              <div>Item</div>
              <div>Quantity</div>
              <div>Amount</div>
              <div>Status</div>
              {userInfo?.isAdmin && <div className="text-right">Actions</div>}
            </div>

            <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {loading ? (
                <TableSkeleton rows={5} cols={9} />
              ) : orders.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-white">
                  No orders found.
                </div>
              ) : (
                orders.map((o, index) => (
                  <div
                    key={o._id}
                    className="hidden lg:grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_120px] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                  >
                    <div>{index + 1}</div>
                    <div>{o.date}</div>
                    <div>{o.salesmanName || o.salesman}</div>
                    <div>{o.customerName || o.customer}</div>
                    <div>{o.itemName || o.item}</div>
                    <div>{o.quantity}</div>
                    <div>{o.amount}</div>
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
            className="w-full md:w-[500px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
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
              <div>
                <label className="block text-gray-700 font-medium">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Salesman <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={salesman}
                  onChange={(e) => setSalesman(e.target.value)}
                >
                  <option value="">Select Salesman</option>
                  {salesmen.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

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
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Item <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                >
                  <option value="">Select Item</option>
                  {items.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Status
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {orderStatusOptions.map((s, i) => (
                    <option key={i}>{s}</option>
                  ))}
                </select>
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

export default SalesmanwiseOrders;
