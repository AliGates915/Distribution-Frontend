import React, { useState, useEffect, useRef, useCallback } from "react";
import { api } from "../../../../context/ApiService";
import { LedgerTemplate } from "../../../../helper/LedgerReportTemplate";
import CommanHeader from "../../Components/CommanHeader";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import TableSkeleton from "../../Components/Skeleton";

const Sales = () => {
  const [salesmanList, setSalesmanList] = useState([]);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [salesRecovery, setSalesRecovery] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  // State declarations
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ledgerRef = useRef(null);
  const recordsPerPage = 10;

  // ✅ Fetch Salesman List
  const fetchSalesmanList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/employees/reports");
      setSalesmanList(response.data || response);
    } catch (error) {
      console.error("Failed to fetch salesmen:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch Sales Data
  const fetchLedgerEntries = useCallback(async () => {
    if (!selectedSalesman) return;
    try {
      setLoading(true);
      const response = await api.get(`/salesman-report/${selectedSalesman}`);

      // ✅ API structure based on your screenshot
      const report = response.data;
      const data = report || [];
      console.log({ report });

      // 🟢 Table 1: Product-level sales
      setLedgerEntries(data);

      // 🟢 Table 2: Summary - you can reuse this to show in the second table
      setSalesRecovery(data);
    } catch (error) {
      console.error("Failed to fetch sales data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedSalesman]);

  useEffect(() => {
    fetchSalesmanList();
  }, [fetchSalesmanList]);

  useEffect(() => {
    fetchLedgerEntries();
    setCurrentPage(1);
  }, [selectedSalesman, selectedDate, fetchLedgerEntries]);

  // ✅ Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = ledgerEntries.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(ledgerEntries.length / recordsPerPage);

  const totalPurchase = ledgerEntries.reduce(
    (sum, e) => sum + (parseFloat(e.purchaseTotal) || 0),
    0
  );
  const totalSales = ledgerEntries.reduce(
    (sum, e) => sum + (parseFloat(e.saleTotal) || 0),
    0
  );

  const totalSalesAmount = salesRecovery.reduce(
    (sum, e) => sum + (parseFloat(e.saleTotal) || 0),
    0
  );
  const totalRecovery = salesRecovery.reduce(
    (sum, e) => sum + (parseFloat(e.recovery) || 0),
    0
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />

      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-newPrimary">Sales</h1>
        </div>

        {/* 🔹 Filters */}
        <div className="flex flex-wrap gap-5 mb-6">
          <div className="w-[200px]">
            <label className="block text-gray-700 font-medium mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
            />
          </div>

          <div className="w-[300px]">
            <label className="block text-gray-700 font-medium mb-2">
              Salesman
            </label>
            <select
              value={selectedSalesman}
              onChange={(e) => setSelectedSalesman(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
            >
              <option value="">Select Salesman</option>
              {salesmanList.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.employeeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 🔹 Sales Details Table */}
        <div className="rounded-xl shadow border border-gray-200 overflow-hidden bg-white">
          {loading ? (
            <TableSkeleton
              rows={ledgerEntries.length > 0 ? ledgerEntries.length : 5}
              cols={8} // SR, Order ID, Date, Salesman, Customer, Phone, Actions
              className="lg:grid-cols-[0.2fr_1fr_1fr_1fr_1fr_0.5fr_1fr_1fr_1fr]"
            />
          ) : ledgerEntries.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No sales records found.
            </div>
          ) : (
            <>
              <div className="hidden lg:grid grid-cols-[0.2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                <div>Sr</div>
                <div>Supplier</div>
                <div>Product</div>
                <div>Weight</div>
                <div>Purchase Price</div>
                <div>Sale Price</div>
                <div>Qty</div>
                <div>Purchase Total</div>
                <div>Sale Total</div>
                <div>Profit</div>
              </div>

              <div className="divide-y divide-gray-100">
                {currentRecords.map((entry, i) => (
                  <div
                    key={entry._id || i}
                    className="grid grid-cols-[0.2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-3 hover:bg-gray-50 text-sm"
                  >
                    <div>{i + 1 + indexOfFirstRecord}</div>
                    <div>{entry.supplier}</div>
                    <div>{entry.product}</div>
                    <div>{entry.weight}</div>
                    <div>{entry.purchasePrice}</div>
                    <div>{entry.salePrice}</div>
                    <div>{entry.qty}</div>
                    <div>{entry.purchaseTotal}</div>
                    <div>{entry.saleTotal}</div>
                    <div>
                      {(parseInt(entry.saleTotal) || 0) -
                        (parseInt(entry.purchaseTotal) || 0)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="grid whitespace-nowrap grid-cols-[0.2fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold w-full text-gray-700">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="text-red-600">
                  Total Pur: {Math.round(totalPurchase)}
                </div>
                <div className="text-green-600">
                  Total sal: {Math.round(totalSales)}
                </div>
                <div className="text-blue-600">
                  Total Prof: {Math.round(totalSales - totalPurchase)}
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

        {/* 🔹 Sales & Recovery Table */}
        <div className="rounded-xl shadow border border-gray-200 overflow-hidden bg-white mt-8">
          {loading ? (
            // 🟡 Skeleton Loader (same style as first table)
            <TableSkeleton
              rows={salesRecovery.length > 0 ? salesRecovery.length : 5}
              cols={6} // SR, Customer, Section, Address, Sales, Recovery
              className="lg:grid-cols-[0.2fr_1fr_1fr_1.5fr_1fr_1fr]"
            />
          ) : salesRecovery.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No sales/recovery data available.
            </div>
          ) : (
            <>
              <div className="hidden lg:grid grid-cols-[0.2fr_1fr_1fr_1.5fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase">
                <div>Sr</div>
                <div>Customer</div>
                <div>Section/Area</div>
                <div>Customer Address</div>
                <div>Sales</div>
                <div>Recovery</div>
              </div>

              <div className="divide-y divide-gray-100">
                {salesRecovery.map((rec, i) => (
                  <div
                    key={rec._id || i}
                    className="grid grid-cols-[0.2fr_1fr_1fr_1.5fr_1fr_1fr] items-center gap-4 px-6 py-3 hover:bg-gray-50 text-sm"
                  >
                    <div>{i + 1}</div>
                    <div>{rec.customer}</div>
                    <div>{rec.sectionArea || "-"}</div>
                    <div>{rec.customerAddress}</div>
                    <div>{rec.saleTotal}</div>
                    <div>{rec.recovery || 0}</div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="grid grid-cols-[0.2fr_1fr_1fr_1.5fr_1fr_1fr] whitespace-nowrap gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-700">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div className="text-blue-600">
                  Total Sal: {Math.round(totalSalesAmount)}
                </div>
                <div className="text-green-600">
                  Total Rec: {Math.round(totalRecovery)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
