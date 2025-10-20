import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { SquarePen, Trash2 } from "lucide-react";
import gsap from "gsap";
import Swal from "sweetalert2";
import axios from "axios";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";

const categories = [
  "Utilities",
  "Payroll",
  "Office Supplies",
  "Rent",
  "Maintenance",
  "Miscellaneous",
];

const BankLedger = () => {
  const [ledgerList, setLedgerList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  // form states
  const [category, setCategory] = useState("");
  const [bankName, setBankName] = useState("");
  const [transactionType, setTransactionType] = useState("Credit");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/bank-ledger`;

  // Animation
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

  // Fetch ledger
  const fetchLedger = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setLedgerList(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch ledger:", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  // Form validation
  const validateForm = () => {
    if (!category) return toast.error("Please select a category"), false;
    if (!bankName) return toast.error("Please enter bank name"), false;
    if (!amount || isNaN(amount))
      return toast.error("Enter valid amount"), false;
    if (!date) return toast.error("Please select date"), false;
    return true;
  };

  // Save or Update
  const handleSave = async () => {
    if (!validateForm()) return;
    const data = {
      category,
      bankName,
      transactionType,
      amount,
      date,
      description,
    };
    const headers = {
      Authorization: `Bearer ${userInfo?.token}`,
      "Content-Type": "application/json",
    };
    try {
      if (isEdit && editId) {
        await axios.put(`${API_URL}/${editId}`, data, { headers });
        toast.success("Ledger updated successfully");
      } else {
        await axios.post(API_URL, data, { headers });
        toast.success("Ledger added successfully");
      }
      fetchLedger();
      resetForm();
      setIsSliderOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setEditId(item._id);
    setCategory(item.category);
    setBankName(item.bankName);
    setTransactionType(item.transactionType);
    setAmount(item.amount);
    setDate(item.date);
    setDescription(item.description);
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
        text: "This will be deleted permanently!",
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
            setLedgerList(ledgerList.filter((item) => item._id !== id));
            swal.fire("Deleted!", "Ledger deleted successfully", "success");
          } catch (error) {
            swal.fire("Error!", "Failed to delete ledger", "error");
          }
        }
      });
  };

  const resetForm = () => {
    setIsEdit(false);
    setEditId(null);
    setCategory("");
    setBankName("");
    setTransactionType("Credit");
    setAmount("");
    setDate("");
    setDescription("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">Bank Ledger</h1>
          <p className="text-gray-500 text-sm">
            Manage all bank ledger entries
          </p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/90"
          onClick={() => {
            resetForm();
            setIsSliderOpen(true);
          }}
        >
          + Add Ledger Entry
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="hidden lg:grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_2fr_100px] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
              <div>SR#</div>
              <div>Category</div>
              <div>Bank Name</div>
              <div>Type</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Description</div>
              {userInfo?.isAdmin && <div className="text-right">Actions</div>}
            </div>

            <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {loading ? (
                <TableSkeleton rows={5} cols={8} />
              ) : ledgerList.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-white">
                  No ledger entries found.
                </div>
              ) : (
                ledgerList.map((item, index) => (
                  <div
                    key={item._id}
                    className="hidden lg:grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_2fr_100px] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50"
                  >
                    <div>{index + 1}</div>
                    <div>{item.category}</div>
                    <div>{item.bankName}</div>
                    <div>{item.transactionType}</div>
                    <div>{item.amount}</div>
                    <div>{item.date}</div>
                    <div>{item.description}</div>
                    {userInfo?.isAdmin && (
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
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
                {isEdit ? "Update Ledger Entry" : "Add New Ledger Entry"}
              </h2>
              <button
                className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                onClick={() => setIsSliderOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* Category */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bank name */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Meezan Bank"
                />
              </div>

              {/* Type and Amount */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Type
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                  >
                    <option>Credit</option>
                    <option>Debit</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Amount
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-700 font-medium">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details"
                  rows={3}
                />
              </div>

              <button
                className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 w-full"
                onClick={handleSave}
              >
                Save Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankLedger;
