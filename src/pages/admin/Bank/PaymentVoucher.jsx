import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { SquarePen, Trash2 } from "lucide-react";
import TableSkeleton from "../Components/Skeleton";
import CommanHeader from "../Components/CommanHeader";

const PaymentVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [nextReceiptId, setNextReceiptId] = useState("BP-001");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const sliderRef = useRef(null);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/bank-payment-voucher`;

  const [bankData, setBankData] = useState({
    receiptId: "",
    date: new Date().toISOString().split("T")[0],
    supplier: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    supplierPayable: 0,
    amountPaid: 0,
    remarks: "",
  });

  /** ==================== FETCH BANKS ==================== **/
  const fetchBanks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/banks`);
      setBanks(res.data?.data || []);
    } catch {
      setBanks([]);
    }
  };

  /** ==================== FETCH SUPPLIERS ==================== **/
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/suppliers`);
      setSuppliers(res.data || []);
    } catch {
      setSuppliers([]);
    }
  };

  /** ==================== FETCH VOUCHERS ==================== **/
  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      const data = res.data?.data || res.data || [];
      setVouchers(data);
      setFilteredVouchers(data);
    } catch {
      toast.error("Failed to fetch vouchers");
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  useEffect(() => {
    fetchBanks();
    fetchSuppliers();
    fetchVouchers();
  }, []);

  /** ==================== AUTO RECEIPT ID ==================== **/
  useEffect(() => {
    if (vouchers.length > 0) {
      const maxNo = Math.max(
        ...vouchers.map((v) => {
          const match = v.receiptId?.match(/BP-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextReceiptId("BP-" + (maxNo + 1).toString().padStart(3, "0"));
    } else setNextReceiptId("BP-001");
  }, [vouchers]);

  /** ==================== RESET FORM ==================== **/
  const resetForm = () => {
    setBankData({
      receiptId: "",
      date: new Date().toISOString().split("T")[0],
      supplier: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      supplierPayable: 0,
      amountPaid: 0,
      remarks: "",
    });
    setEditingVoucher(null);
    setIsSliderOpen(false);
  };

  /** ==================== ADD ==================== **/
  const handleAdd = () => {
    resetForm();
    setIsSliderOpen(true);
  };

  /** ==================== EDIT ==================== **/
  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    const bank = voucher.bankSection || {};
    setBankData({
      receiptId: voucher.receiptId || "",
      date: voucher.date?.split("T")[0] || new Date().toISOString().split("T")[0],
      supplier: bank.supplier || "",
      bankName: bank.bankName || "",
      accountName: bank.accountHolderName || "",
      accountNumber: bank.accountNumber || "",
      supplierPayable: bank.supplierPayable || 0,
      amountPaid: voucher.amountPaid || 0,
      remarks: voucher.remarks || "",
    });
    setIsSliderOpen(true);
  };

  /** ==================== SUBMIT ==================== **/
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const voucherData = {
        receiptId: editingVoucher ? bankData.receiptId : nextReceiptId,
        date: bankData.date,
        mode: "Bank",
        amountPaid: bankData.amountPaid,
        bankSection: {
          supplier: bankData.supplier,
          bankName: bankData.bankName,
          accountNumber: bankData.accountNumber,
          accountHolderName: bankData.accountName,
          supplierPayable: bankData.supplierPayable,
        },
        remarks: bankData.remarks,
      };

      if (editingVoucher?._id) {
        await axios.put(`${API_URL}/${editingVoucher._id}`, voucherData);
        toast.success("Bank voucher updated");
      } else {
        await axios.post(API_URL, voucherData);
        toast.success("Bank voucher created");
      }

      await fetchVouchers();
      resetForm();
    } catch (error) {
      toast.error("Failed to save voucher");
    }
  };

  /** ==================== DELETE ==================== **/
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      await axios.delete(`${API_URL}/${id}`);
      fetchVouchers();
      toast.success("Deleted successfully");
    }
  };

  /** ==================== PAGINATION ==================== **/
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredVouchers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredVouchers.length / recordsPerPage);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">Bank Payment Vouchers</h1>
            <p className="text-sm text-gray-500">
              Showing {filteredVouchers.length} of {vouchers.length}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by Voucher ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAdd}
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
            >
              + Add Payment Voucher
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-xl shadow overflow-hidden">
          {loading ? (
            <TableSkeleton rows={6} cols={7} />
          ) : currentRecords.length === 0 ? (
            <div className="text-center py-4 text-gray-500 bg-white">No vouchers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
                  <tr>
                    <th className="py-3 px-4 text-left">#</th>
                    <th className="py-3 px-4 text-left">Receipt ID</th>
                    <th className="py-3 px-4 text-left">Supplier</th>
                    <th className="py-3 px-4 text-left">Bank</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {currentRecords.map((v, i) => (
                    <tr key={v._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{indexOfFirst + i + 1}</td>
                      <td className="py-3 px-4">{v.receiptId}</td>
                      <td className="py-3 px-4">{v.bankSection?.supplierName || "-"}</td>
                      <td className="py-3 px-4">{v.bankSection?.bankName || "-"}</td>
                      <td className="py-3 px-4">Rs.{v.amountPaid}</td>
                      <td className="py-3 px-4">
                        {new Date(v.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(v)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(v._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="bg-white rounded-2xl w-full md:w-[800px] shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold text-newPrimary">
                  {editingVoucher ? "Update Payment Voucher" : "Add Payment Voucher"}
                </h2>
                <button onClick={resetForm} className="text-2xl text-gray-500">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Bank Info */}
                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={bankData.date}
                      onChange={(e) =>
                        setBankData({ ...bankData, date: e.target.value })
                      }
                      className="w-full p-3 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Receipt ID</label>
                    <input
                      type="text"
                      value={editingVoucher ? bankData.receiptId : nextReceiptId}
                      readOnly
                      className="w-full p-3 border rounded-md bg-gray-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block font-medium mb-1">Bank Name</label>
                    <select
                      value={bankData.bankName}
                      onChange={(e) => {
                        const selected = banks.find((b) => b.bankName === e.target.value);
                        setBankData({
                          ...bankData,
                          bankName: selected?.bankName || "",
                          accountName: selected?.accountName || "",
                          accountNumber: selected?.accountNumber || "",
                        });
                      }}
                      className="w-full p-3 border rounded-md"
                      required
                    >
                      <option value="">Select Bank</option>
                      {banks.map((b, i) => (
                        <option key={i} value={b.bankName}>
                          {b.bankName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Account Holder</label>
                    <input
                      type="text"
                      value={bankData.accountName}
                      onChange={(e) =>
                        setBankData({ ...bankData, accountName: e.target.value })
                      }
                      className="w-full p-3 border rounded-md bg-gray-50"
                      placeholder="Account Holder Name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Account Number</label>
                    <input
                    disabled
                      value={bankData.accountNumber}
                      onChange={(e) =>
                        setBankData({ ...bankData, accountNumber: e.target.value })
                      }
                      className="w-full p-3 border rounded-md"
                      placeholder="Auto Account Number"
                    />
                  </div>
                      <div>
                    <label className="block font-medium mb-1">Bank Balance</label>
                    <input
                      disabled
                      value={bankData.accountNumber}
                      onChange={(e) =>
                        setBankData({ ...bankData, accountNumber: e.target.value })
                      }
                      className="w-full p-3 border rounded-md"
                      placeholder="Auto Balance when Bank Select"
                    />
                  </div>
                 
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block font-medium mb-1">Supplier</label>
                    <select
                      value={bankData.supplier}
                      onChange={(e) => {
                        const supplierId = e.target.value;
                        const selectedSupplier = suppliers.find(
                          (s) => s._id === supplierId
                        );
                        setBankData({
                          ...bankData,
                          supplier: supplierId,
                          supplierPayable: selectedSupplier?.payableBalance || 0,
                        });
                      }}
                      className="w-full p-3 border rounded-md"
                      required
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.supplierName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Payable Balance</label>
                    <input
                      type="number"
                      value={bankData.supplierPayable}
                      readOnly
                      className="w-full p-3 border rounded-md bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Amount to Pay <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={bankData.amountPaid}
                      onChange={(e) =>
                        setBankData({
                          ...bankData,
                          amountPaid: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full p-3 border rounded-md"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Remarks</label>
                  <textarea
                    value={bankData.remarks}
                    onChange={(e) =>
                      setBankData({ ...bankData, remarks: e.target.value })
                    }
                    rows="3"
                    className="w-full p-3 border rounded-md"
                    placeholder="Enter remarks"
                  />
                </div>

               

                <button
                  type="submit"
                  className="w-full bg-newPrimary text-white py-3 rounded-lg hover:bg-newPrimary/80 transition"
                >
                  Save Payment Voucher
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentVoucher;
