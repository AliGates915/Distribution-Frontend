import React, { useState, useEffect, useRef, useCallback } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";
import Swal from "sweetalert2";
import { api } from "../../../../context/ApiService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { LedgerTemplate } from "../../../../helper/LedgerReportTemplate";
const AmountReceivales = () => {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  // New states for CustomerLedger form
  const [ledgerId, setLedgerId] = useState("");
  const [date, setDate] = useState("");
  const [salesInvoice, setSalesInvoice] = useState("");
  const [status, setStatus] = useState("");
  const ledgerRef = useRef(null);
  // Already present in your code:
  const [customerName, setCustomerName] = useState("");
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
  const [customerList, setCustomerList] = useState([]);
  const [nextCustomerId, setNextCustomerId] = useState("003");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // fetch Customer List
  const fetchCustomerList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/customers");
      setCustomerList(response);
      console.log("Customers:", response);
    } catch (error) {
      console.error("Failed to fetch customer list", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchCustomerList();
  }, [fetchCustomerList]);

  // fetch Customer ID

  // ✅ Fetch customer ledger by selectedCustomer
  const fetchCustomerId = useCallback(async (id) => {
    if (!id) {
      console.log("⚠️ No customer selected yet");
      return; // don’t run when nothing selected
    }

    try {
      setLoading(true);
      console.log("Fetching ledger for:", id);

      const response = await api.get(`/customer-ledger?customer=${id}`);
      setLedgerEntries(response.data);
      console.log("Customer Ledger Data:", response.data);
    } catch (error) {
      console.error("Failed to fetch customer ledger", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerId(selectedCustomer);
    }
  }, [selectedCustomer, fetchCustomerId]);

  // fetch Date
  // ✅ Dynamic fetch by date and customer
  const fetchDate = useCallback(async () => {
    if (!selectedCustomer) return; // no customer selected yet

    try {
      setLoading(true);

      // Build dynamic query params
      let query = `/customer-ledger?customer=${selectedCustomer}`;
      if (dateFrom) query += `&from=${dateFrom}`;
      if (dateTo) query += `&to=${dateTo}`;

      const response = await api.get(query);

      // ✅ Store the ledger results instead of overwriting date state
      setLedgerEntries(response.data?.data || response.data || []);

      console.log("Filtered Ledger (Date Range):", response.data);
    } catch (error) {
      console.error("Failed to fetch ledger by date", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [selectedCustomer, dateFrom, dateTo]);

  useEffect(() => {
    if (selectedCustomer) {
      fetchDate();
    }
  }, [selectedCustomer, dateFrom, dateTo, fetchDate]);

  // Filter ledger data based on selected customer and date range
  const filteredLedger = ledgerEntries.filter((entry) => {
    const entryDate = new Date(entry.date);
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;

    return (
      entry.customerId === selectedCustomer &&
      (!from || entryDate >= from) &&
      (!to || entryDate <= to)
    );
  });

  // Simulate fetching ledger entries
  const fetchLedgerEntries = useCallback(async () => {
    try {
      setLoading(true);
      // Static data already set in state
    } catch (error) {
      console.error("Failed to fetch ledger entries", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  useEffect(() => {
    fetchLedgerEntries();
  }, [fetchLedgerEntries]);

  // Ledger search
  useEffect(() => {
    if (!searchTerm || !searchTerm.startsWith("CUS-")) {
      fetchLedgerEntries();
      return;
    }

    const delayDebounce = setTimeout(() => {
      try {
        setLoading(true);
        const filtered = ledgerEntries.filter((entry) =>
          entry.customerId.toUpperCase().includes(searchTerm.toUpperCase())
        );
        setLedgerEntries(filtered);
      } catch (error) {
        console.error("Search ledger entries failed:", error);
        setLedgerEntries([]);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchLedgerEntries, ledgerEntries]);

  // Generate next customer ID
  useEffect(() => {
    if (ledgerEntries.length > 0) {
      const maxNo = Math.max(
        ...ledgerEntries.map((entry) => {
          const match = entry.customerId?.match(/CUS-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextCustomerId((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextCustomerId("001");
    }
  }, [ledgerEntries]);

  // Reset form fields
  const resetForm = () => {
    setCustomerId("");
    setCustomerName("");
    setTransactionDate("");
    setTransactionType("");
    setAmount("");
    setNotes("");
    setEditingLedgerEntry(null);
    setErrors({});
    setIsSliderOpen(false);
  };
  // Download Report
  const handleDownloadReport = async () => {
    if (!ledgerEntries || ledgerEntries.length === 0) {
      Swal.fire("No Data", "No ledger data available to download.", "info");
      return;
    }

    try {
      const canvas = await html2canvas(ledgerRef.current, {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `${ledgerEntries[0].CustomerName || "Ledger_Report"}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
     
    } catch (error) {
      console.error("Error generating ledger PDF:", error);
      Swal.fire("Error", error.message);
    }
  };

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
  console.log({ ledgerEntries });

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Customer Ledger Details
            </h1>
          </div>
        </div>
        <div className="flex gap-6">
          {/* Left Filter Section */}
          <div className="w-full">
            <div className="space-y-5">
              <div className="flex gap-5 justify-between item-center">
                <div className="flex items-center gap-5">
                  {/* Customer Selection */}
                  <div className="w-[400px]">
                    <label className="block text-gray-700 font-medium mb-2">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedCustomer}
                      onChange={(e) => setSelectedCustomer(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      required
                    >
                      <option value="">Select Customer</option>
                      {customerList.map((cust) => (
                        <option key={cust._id} value={cust._id}>
                          {cust.customerName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date From */}
                  <div className="w-[200px]">
                    <label className="block text-gray-700 font-medium mb-2">
                      Date From
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    />
                  </div>

                  {/* Date To */}
                  <div className="w-[200px]">
                    <label className="block text-gray-700 font-medium mb-2">
                      Date To
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    />
                  </div>
                </div>
                {/* downlode button */}
                {
                  ledgerEntries && ledgerEntries.length > 0 && (
                      <div className="">
                  <button
                    className="mt-6 bg-newPrimary text-white px-4 py-2 rounded-md hover:bg-newPrimary/80"
                    onClick={handleDownloadReport}
                  >
                    Download Report
                  </button>
                </div>
                  )
                }
              
              </div>
            </div>
          </div>

          {/* Right Side Form Content */}
          <div className="flex-1">{/* your main form fields go here */}</div>
        </div>

        <div className="p-0">
          {/* Selection Form */}

          <div className="rounded-xl shadow border border-gray-200 overflow-hidden mt-6">
            {selectedCustomer ? (
              <div className="overflow-y-auto lg:overflow-x-auto max-h-[900px]">
                <div className="min-w-full custom-scrollbar">
                  {/* Table Header */}
                  <div className="hidden lg:grid grid-cols-[0.2fr_0.5fr_0.5fr_2.5fr_repeat(3,0.7fr)] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                    <div>SR</div>
                    <div>Date</div>
                    <div>ID</div>
                    <div>Description</div>
                    <div>Paid</div>
                    <div>Received</div>
                    <div>Balance</div>
                  </div>

                  {/* Table Rows */}
                  <div className="flex flex-col divide-y divide-gray-100">
                    {loading ? (
                      <div className="text-center py-4 text-gray-500 bg-white">
                        Loading...
                      </div>
                    ) : ledgerEntries.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 bg-white">
                        No ledger entries found.
                      </div>
                    ) : (
                      <>
                        {ledgerEntries.map((entry, index) => (
                          <div
                            key={entry.id || index}
                            className="grid grid-cols-[0.2fr_0.5fr_0.5fr_2.5fr_repeat(3,0.7fr)] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                          >
                            <div className="text-gray-600">{index + 1}</div>
                            <div className="text-gray-600">{entry.Date}</div>
                            <div className="text-gray-600">{entry.ID}</div>
                            <div className="text-gray-600">
                              {entry.Description}
                            </div>
                            <div className="text-gray-600">{entry.Paid}</div>
                            <div className="text-gray-600">
                              {entry.Received}
                            </div>
                            <div className="text-gray-600">{entry.Balance}</div>
                          </div>
                        ))}

                        {/* Totals Row */}
                        <div className="hidden lg:grid grid-cols-[0.2fr_0.5fr_0.5fr_2.5fr_repeat(3,0.7fr)] justify-items-start gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                          <div className="col-span-4"></div>

                          {/* Calculate totals */}
                          <div className="text-blue-700 text-center">
                            Total Paid:{" "}
                            <span className="font-bold">
                              {Math.round(
                                ledgerEntries.reduce(
                                  (sum, e) => sum + (parseFloat(e.Paid) || 0),
                                  0
                                )
                              )}
                            </span>
                          </div>
                          <div className="text-green-700 text-center">
                            Total Received:{" "}
                            <span className="font-bold">
                              {Math.round(
                                ledgerEntries.reduce(
                                  (sum, e) =>
                                    sum + (parseFloat(e.Received) || 0),
                                  0
                                )
                              )}
                            </span>
                          </div>
                          <div className="text-red-700 text-center">
                            Total Balance:{" "}
                            <span className="font-bold">
                              {Math.round(
                                ledgerEntries.reduce(
                                  (sum, e) =>
                                    sum + (parseFloat(e.Balance) || 0),
                                  0
                                )
                              )}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 bg-white rounded-lg mt-6">
                Please select a customer to view ledger entries.
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
      {/* Hidden Ledger Template for PDF export */}
<div style={{ position: "absolute", left: "-9999px", top: "0" }}>
  <LedgerTemplate ref={ledgerRef} ledgerEntries={ledgerEntries} />
</div>

    </div>
  );
};

export default AmountReceivales;
