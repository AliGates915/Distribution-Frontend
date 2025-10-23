import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";
import Swal from "sweetalert2";
import { api } from "../../../../context/ApiService";

const ProductwiseOrders = () => {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  // New states for CustomerLedger form
  const [ledgerId, setLedgerId] = useState("");
  const [date, setDate] = useState("");
  const [salesInvoice, setSalesInvoice] = useState("");
  const [status, setStatus] = useState("");

  // Already present in your code:
  const [employeeName, setEmployeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [dateRange, setDateRange] = useState("thisMonth");

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState("");

  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingLedgerEntry, setEditingLedgerEntry] = useState(null);
  const [errors, setErrors] = useState({});
  const [productName, setProductName] = useState([]);
  const [salesmanList, setSalesmanList] = useState([]);
  const [nextCustomerId, setNextCustomerId] = useState("003");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(""); // for selected ID

  // fetch Product Name
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/item-details/reports");
      setProductName(response); // ✅ use .data
      console.log("Product List:", response);
    } catch (error) {
      console.error("Failed to fetch product list", error);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // fetch Product List by ID
  const fetchProductList = useCallback(async (id) => {
    if (!id) {
      console.log("No product selected yet");
      return; // don’t run when nothing selected
    }

    try {
      setLoading(true);
      const response = await api.get(`/sales-report/productwise/${id}`);
      setSalesmanList(response.data);
      console.log("Product Data:", response.data);
    } catch (error) {
      console.error("Failed to fetch product list", error);
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  }, []);

  // useEffect example
  useEffect(() => {
    if (selectedProduct) {
      fetchProductList(selectedProduct);
    }
  }, [selectedProduct, fetchProductList]);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = ledgerEntries.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(ledgerEntries.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  console.log("Tttsstts ", salesmanList);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Product Order Details
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* <input
              type="text"
              placeholder="Enter Customer ID eg: CUS-001"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 w-[250px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary"
            /> */}
            {/* <button
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
              onClick={handleAddLedgerEntry}
            >
              + Add Ledger Entry
            </button> */}
          </div>
        </div>
        <div className="flex gap-6">
          {/* Left Filter Section */}
          <div className="w-full">
            <div className="space-y-5">
              <div className="flex gap-5">
                {/* Customer Selection */}
                <div className="w-[400px]">
                  <label className="block text-gray-700 font-medium mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    required
                  >
                    <option value="">Select Product</option>
                    {productName?.map((cust) => (
                      <option key={cust._id} value={cust._id}>
                        {cust.itemName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Form Content */}
          <div className="flex-1">{/* your main form fields go here */}</div>
        </div>

        <div className="p-0">
          {/* Selection Form */}
          <div className="rounded-xl shadow border border-gray-200 overflow-hidden mt-6">
            {selectedProduct ? (
              <div className="overflow-y-auto lg:overflow-x-auto max-h-[900px]">
                <div className="min-w-full custom-scrollbar">
                  {/* Table Header */}
                  <div className="hidden lg:grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                    <div>SR</div>
                    <div>Invoice No</div>
                    <div>Invoice Date</div>
                    <div>Order ID</div>
                    <div>Customer Name</div>
                    <div>Salesman</div>
                    <div>Total Amount</div>
                    <div>View</div>
                  </div>

                  {/* Table Rows */}
                  <div className="flex flex-col divide-y divide-gray-100">
                    {loading ? (
                      <div className="text-center py-4 text-gray-500 bg-white">
                        Loading...
                      </div>
                    ) : (
                      <>
                        {salesmanList.length > 0 ? (
                          salesmanList.map((entry, index) => (
                            <div
                              key={entry._id}
                              className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                            >
                              <div className="text-gray-600">{index + 1}</div>

                              <div className="text-gray-600">
                                {entry.invoiceNo}
                              </div>
                              <div className="text-gray-600">
                                {new Date(
                                  entry.invoiceDate
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-gray-600">
                                {entry?.orderTakingId?.orderId || "N/A"}
                              </div>
                              <div className="text-gray-600">
                                {entry?.orderTakingId?.customerId
                                  ?.customerName || "N/A"}
                              </div>
                              <div className="text-gray-600">
                                {entry?.salesmanId?.employeeName}
                              </div>
                              <div className="text-gray-600">
                                {entry?.totalAmount}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 bg-white">
                            No records found for this product.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 bg-white rounded-lg mt-6">
                Please select a product to view product entries.
              </div>
            )}

            {/* Pagination Controls (Optional) */}
            {totalPages > 1 && (
              <div className="flex justify-between my-4 px-10">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstRecord + 1} to{" "}
                  {Math.min(indexOfLastRecord, filteredLedger.length)} of{" "}
                  {filteredLedger.length} records
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
        </div>

        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingLedgerEntry
                    ? "Update Ledger Entry"
                    : "Add a New Ledger Entry"}
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form className="space-y-4 p-4 md:p-6">
                {/* Top Section */}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                >
                  {loading
                    ? "Saving..."
                    : editingLedgerEntry
                    ? "Update Ledger Entry"
                    : "Save Ledger Entry"}
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

export default ProductwiseOrders;
