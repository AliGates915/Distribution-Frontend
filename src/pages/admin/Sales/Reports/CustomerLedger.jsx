import React, { useState, useEffect, useRef, useCallback } from "react";
import { api } from "../../../../context/ApiService";
import axios from "axios";
import { LedgerTemplate } from "../../../../helper/LedgerReportTemplate";
import CommanHeader from "../../Components/CommanHeader";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import TableSkeleton from "../../Components/Skeleton";
import {  handleLedgerPrint } from "../../../../helper/SalesPrintView";
import { Printer } from "lucide-react";

const CustomerLedger = () => {
  const [customerList, setCustomerList] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ledgerRef = useRef(null);
  const recordsPerPage = 10;

  // 1. FETCH CUSTOMERS LIST
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/customers/isPending`
      );
      setCustomerList(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      Swal.fire("Error", "Failed to load customers", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. FETCH CUSTOMER LEDGER ENTRIES (uses From & To directly)
  const fetchCustomerLedger = useCallback(async () => {
    if (!selectedCustomer) return;

    try {
      setLoading(true);
      let query = `/customer-ledger?customer=${selectedCustomer}`;
      if (dateFrom && dateTo) {
        query += `&from=${dateFrom}&to=${dateTo}`;
      }

      const response = await api.get(query);

      // Transform: Paid → Debit, Received → Credit
      const transformedData = (response.data?.data || response.data || []).map(
        (entry) => ({
          ...entry,
          Debit: entry.Paid || "0.00",
          Credit: entry.Received || "0.00",
          SR: entry.SR,
          ID: entry.ID,
          Date: entry.Date,
          CustomerName: entry.CustomerName,
          Description: entry.Description,
          Balance: entry.Balance,
        })
      );

      setLedgerEntries(transformedData);
    } catch (error) {
      console.error("Failed to fetch ledger entries:", error);
      Swal.fire("Error", "Failed to load ledger entries", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer, dateFrom, dateTo]);

  // INITIAL LOAD
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // REFETCH LEDGER when filters change
  useEffect(() => {
    fetchCustomerLedger();
    setCurrentPage(1);
  }, [fetchCustomerLedger]);



  // Calculate totals
  const totalDebit = ledgerEntries.reduce(
    (sum, entry) => sum + (parseFloat(entry.Debit) || 0),
    0
  );
  const totalCredit = ledgerEntries.reduce(
    (sum, entry) => sum + (parseFloat(entry.Credit) || 0),
    0
  );
  const totalBalance = ledgerEntries.reduce(
    (sum, entry) => sum + (parseFloat(entry.Balance) || 0),
    0
  );

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = ledgerEntries.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(ledgerEntries.length / recordsPerPage);
console.log({ledgerEntries});

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />

      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-newPrimary">
            Customer Ledger Details
          </h1>

          {ledgerEntries.length > 0 && (
            <button
              onClick={() => handleLedgerPrint(ledgerEntries)}
              className="flex items-center gap-2 bg-newPrimary text-white px-4 py-2 rounded-md hover:bg-newPrimary/80"
            >
              <Printer size={18} /> 
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-5 mb-6">
          {/* 1. Customer Selection */}
          <div className="w-[300px]">
            <label className="block text-gray-700 font-medium mb-2">
              Customer Name *
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
            >
              <option value="">Select Customer</option>
              {customerList.map((cust) => (
                <option key={cust._id} value={cust._id}>
                  {cust.customerName}
                </option>
              ))}
            </select>
          </div>

          {/* 2. From Date */}
          <div className="w-[200px]">
            <label className="block text-gray-700 font-medium mb-2">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
            />
          </div>

          {/* 3. To Date */}
          <div className="w-[200px]">
            <label className="block text-gray-700 font-medium mb-2">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
            />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="rounded-xl shadow border border-gray-200 overflow-hidden bg-white">
          {loading ? (
            <TableSkeleton
              rows={ledgerEntries.length > 0 ? ledgerEntries.length : 5}
              cols={7} // SR, Order ID, Date, Salesman, Customer, Phone, Actions
              className="lg:grid-cols-[0.3fr_0.7fr_0.7fr_2fr_1fr_1fr_1fr]"
            />
          ) : !selectedCustomer ? (
            <div className="text-center py-6 text-gray-500">
              Please select a customer to view ledger entries.
            </div>
          ) : ledgerEntries.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No ledger entries found.
            </div>
          ) : (
            <>
              <div className="hidden lg:grid grid-cols-[0.3fr_0.7fr_0.7fr_2fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                <div>SR</div>
                <div>Date</div>
                <div>ID</div>
                <div>Description</div>
                <div>Debit</div>
                <div>Credit</div>
                <div>Balance</div>
              </div>

              <div className="divide-y divide-gray-100">
                {currentRecords.map((entry, i) => (
                  <div
                    key={entry._id || i}
                    className="grid grid-cols-[0.3fr_0.7fr_0.7fr_2fr_1fr_1fr_1fr] items-center gap-4 px-6 py-3 hover:bg-gray-50 text-sm"
                  >
                    <div>{i + 1 + indexOfFirstRecord}</div>
                    <div>{entry.Date}</div>
                    <div>{entry.ID || "-"}</div>
                    <div>{entry.Description || "-"}</div>
                    <div>{entry.Debit || "-"}</div>
                    <div>{entry.Credit || "-"}</div>
                    <div>{entry.Balance || "-"}</div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="grid grid-cols-[3.7fr_1fr_1fr_1fr] whitespace-nowrap gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-700">
                <div></div>
                <div className="text-red-600">
                  Total Debit: {totalDebit.toLocaleString()}
                </div>
                <div className="text-green-600">
                  Total Credit: {totalCredit.toLocaleString()}
                </div>
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center py-4 px-6 border-t bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstRecord + 1} to{" "}
                {Math.min(indexOfLastRecord, ledgerEntries.length)} of{" "}
                {ledgerEntries.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-newPrimary text-white"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-newPrimary text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Template for PDF
      <div style={{ position: "absolute", left: "-9999px" }}>
        <LedgerTemplate ref={ledgerRef} ledgerEntries={ledgerEntries} />
      </div> */}
    </div>
  );
};

export default CustomerLedger;
