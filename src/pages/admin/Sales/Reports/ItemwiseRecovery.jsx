import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import gsap from "gsap";
import Swal from "sweetalert2";
import axios from "axios";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";

const paymentTypes = ["Cash", "Bank Transfer", "Cheque", "Online", "Other"];

const ItemwiseRecovery = () => {
  const [recoveryList, setRecoveryList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form fields
  const [date, setDate] = useState("");
  const [customer, setCustomer] = useState("");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("Cash");
  const [remarks, setRemarks] = useState("");

  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/itemwise-recovery`;

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

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/customers`
      );
      setCustomerList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  // Fetch items
  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/items`);
      setItemList(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Fetch recoveries
  const fetchRecoveries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setRecoveryList(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchItems();
    fetchRecoveries();
  }, [fetchCustomers, fetchItems, fetchRecoveries]);

  // Validate form
  const validateForm = () => {
    if (!date) return toast.error("Please select a date"), false;
    if (!customer) return toast.error("Please select a customer"), false;
    if (!item) return toast.error("Please select an item"), false;
    if (!quantity || Number(quantity) <= 0)
      return toast.error("Enter valid quantity"), false;
    if (!amount || Number(amount) <= 0)
      return toast.error("Enter valid amount"), false;
    return true;
  };

  // Save / Update
  const handleSave = async () => {
    if (!validateForm()) return;

    const data = {
      date,
      customer,
      item,
      quantity,
      amount,
      paymentType,
      remarks,
    };
    const headers = {
      Authorization: `Bearer ${userInfo?.token}`,
      "Content-Type": "application/json",
    };

    try {
      if (isEdit && editId) {
        await axios.put(`${API_URL}/${editId}`, data, { headers });
        toast.success("Item recovery updated successfully");
      } else {
        await axios.post(API_URL, data, { headers });
        toast.success("Item recovery added successfully");
      }
      fetchRecoveries();
      resetForm();
      setIsSliderOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (record) => {
    setIsEdit(true);
    setEditId(record._id);
    setDate(record.date);
    setCustomer(record.customer);
    setItem(record.item);
    setQuantity(record.quantity);
    setAmount(record.amount);
    setPaymentType(record.paymentType);
    setRemarks(record.remarks || "");
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
        text: "This record will be permanently deleted.",
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
            setRecoveryList(recoveryList.filter((r) => r._id !== id));
            swal.fire("Deleted!", "Record deleted successfully.", "success");
          } catch {
            swal.fire("Error!", "Failed to delete record.", "error");
          }
        }
      });
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditId(null);
    setDate("");
    setCustomer("");
    setItem("");
    setQuantity("");
    setAmount("");
    setPaymentType("Cash");
    setRemarks("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <CommanHeader />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">
            Itemwise Recovery
          </h1>
          <p className="text-gray-500 text-sm">
            Manage recoveries received for each item
          </p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/90"
          onClick={() => {
            resetForm();
            setIsSliderOpen(true);
          }}
        >
          + Add Recovery
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="hidden lg:grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr_120px] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
              <div>SR#</div>
              <div>Date</div>
              <div>Customer</div>
              <div>Item</div>
              <div>Quantity</div>
              <div>Amount</div>
              <div>Payment Type</div>
              <div>Remarks</div>
              {userInfo?.isAdmin && <div className="text-right">Actions</div>}
            </div>

            <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {loading ? (
                <TableSkeleton rows={5} cols={9} />
              ) : recoveryList.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-white">
                  No recoveries found.
                </div>
              ) : (
                recoveryList.map((r, index) => (
                  <div
                    key={r._id}
                    className="hidden lg:grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr_1.5fr_120px] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                  >
                    <div>{index + 1}</div>
                    <div>{r.date}</div>
                    <div>{r.customerName || r.customer}</div>
                    <div>{r.itemName || r.item}</div>
                    <div>{r.quantity}</div>
                    <div>{r.amount}</div>
                    <div>{r.paymentType}</div>
                    <div>{r.remarks}</div>
                    {userInfo?.isAdmin && (
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(r)}
                          className="text-blue-600"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
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
                {isEdit ? "Update Recovery" : "Add New Recovery"}
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
                  {itemList.map((i) => (
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
                  Payment Type
                </label>
                <select
                  className="w-full p-2 border rounded"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  {paymentTypes.map((p, i) => (
                    <option key={i}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Remarks
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>

              <button
                className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 w-full"
                onClick={handleSave}
              >
                Save Recovery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemwiseRecovery;
