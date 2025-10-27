import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";
import toast from "react-hot-toast";

const CreditAgingReport = () => {
  const [loading, setLoading] = useState(false);

  const fetchSalesmenOptions = useCallback(async () => {
    try {
      setLoading(true);
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/employees/orders`);
    } catch (error) {
      console.error("Failed to fetch salesmen:", error);
      toast.error("Using static data (no API connected)");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesmenOptions();
  }, [fetchSalesmenOptions]);

  // ✅ Static data with "Outstanding" column added
  const staticData = [
    {
      sr: 1,
      customer: "280030 - Mani Somsyewala (Youhna Abad)",
      invoiceNo: "7207",
      deliveryDate: "10-09-2025",
      allowDays: 30,
      billDays: 45,
      debit: 246900,
      credit: 78180,
      underCredit: 0,
      due: 168720,
      outstanding: 168720,
    },
    {
      sr: 2,
      customer: "280030 - Mani Somsyewala (Youhna Abad)",
      invoiceNo: "7216",
      deliveryDate: "16-09-2025",
      allowDays: 30,
      billDays: 39,
      debit: 490800,
      credit: 80000,
      underCredit: 0,
      due: 410800,
      outstanding: 410800,
    },
    {
      sr: 3,
      customer: "280030 - Mani Somsyewala (Youhna Abad)",
      invoiceNo: "7642",
      deliveryDate: "15-10-2025",
      allowDays: 30,
      billDays: 10,
      debit: 246900,
      credit: 0,
      underCredit: 246900,
      due: 0,
      outstanding: 246900,
    },
    {
      sr: 4,
      customer: "280037 - Mahar St (Walton Work Shop)",
      invoiceNo: "4172",
      deliveryDate: "15-07-2025",
      allowDays: 30,
      billDays: 20,
      debit: 248000,
      credit: 200000,
      underCredit: 0,
      due: 48000,
      outstanding: 48000,
    },
    {
      sr: 5,
      customer: "280037 - Mahar St (Walton Work Shop)",
      invoiceNo: "7915",
      deliveryDate: "13-08-2025",
      allowDays: 30,
      billDays: 60,
      debit: 248000,
      credit: 0,
      underCredit: 0,
      due: 248000,
      outstanding: 248000,
    },
  ];

  // ✅ Totals calculation
  const totalDebit = staticData.reduce((sum, d) => sum + d.debit, 0);
  const totalCredit = staticData.reduce((sum, d) => sum + d.credit, 0);
  const totalUnderCredit = staticData.reduce(
    (sum, d) => sum + d.underCredit,
    0
  );
  const totalDue = staticData.reduce((sum, d) => sum + d.due, 0);
  const totalOutstanding = staticData.reduce(
    (sum, d) => sum + d.outstanding,
    0
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-newPrimary">
            Credit Aging Report
          </h1>
        </div>

        {/* 🔹 Credit Aging Report Table */}
        <div className="rounded-xl shadow border border-gray-200 overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="inline-block min-w-[1500px] w-full align-middle">
                {/* Header */}
                <div className="hidden lg:grid grid-cols-[0.3fr_1.5fr_1fr_1fr_0.7fr_0.7fr_1fr_1fr_1fr_1fr_1fr] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                  <div>SR</div>
                  <div>Customer</div>
                  <div>Invoice No</div>
                  <div>Delivery Date</div>
                  <div>Allow Days</div>
                  <div>Bill Days</div>
                  <div>Debit</div>
                  <div>Credit</div>
                  <div>Under Credit</div>
                  <div>Due</div>
                  <div>Outstanding</div>
                </div>

                {/* Body */}
                <div className="flex flex-col divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton rows={5} cols={11} />
                  ) : (
                    staticData.map((row, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-[0.3fr_1.5fr_1fr_1fr_0.7fr_0.7fr_1fr_1fr_1fr_1fr_1fr] items-center gap-6 px-6 py-3 text-sm bg-white hover:bg-gray-50 transition"
                      >
                        <div>{row.sr}</div>
                        <div>{row.customer}</div>
                        <div>{row.invoiceNo}</div>
                        <div>{row.deliveryDate}</div>
                        <div>{row.allowDays}</div>
                        <div>{row.billDays}</div>
                        <div>{row.debit.toLocaleString()}</div>
                        <div>{row.credit.toLocaleString()}</div>
                        <div className={` px-2 py-1 rounded`}>
                          {row.underCredit > 0
                            ? row.underCredit.toLocaleString()
                            : "-"}
                        </div>
                        <div className={`$ px-2 py-1 rounded`}>
                          {row.due > 0 ? row.due.toLocaleString() : "-"}
                        </div>
                        <div className="text-blue-600 font-semibold">
                          {row.outstanding.toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Totals Row */}
                <div className="grid grid-cols-[0.3fr_1.5fr_1fr_1fr_0.7fr_0.7fr_1fr_1fr_1fr_1fr_1fr] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-700 whitespace-nowrap">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="text-blue-600">
                    Total Deb: {totalDebit.toLocaleString()}
                  </div>
                  <div className="text-green-600">
                    Total Cred: {totalCredit.toLocaleString()}
                  </div>
                  <div className="text-orange-600">
                    Total Under Cred: {totalUnderCredit.toLocaleString()}
                  </div>
                  <div className="text-red-600">
                    Total Due: {totalDue.toLocaleString()}
                  </div>
                  <div className="text-blue-800">
                    Total Outstand: {totalOutstanding.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default CreditAgingReport;
