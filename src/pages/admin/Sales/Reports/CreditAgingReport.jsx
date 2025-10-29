import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";
import toast from "react-hot-toast";

const CreditAgingReport = () => {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [totals, setTotals] = useState({
    totalDebit: 0,
    totalCredit: 0,
    totalUnderCredit: 0,
    totalDue: 0,
    totalOutstanding: 0
  });

  const fetchCreditAging = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/credit-aging`);
      

      if (response.data.success) {
        setApiData(response.data.data);
        setTotals(response.data.totals);
        console.log("Credit Aging Data:", response.data.data);  
        toast.success("Credit aging data loaded successfully");
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
      
    } catch (error) {
      console.error("Failed to fetch credit aging data:", error);
      toast.error("Failed to load data from API");
      // Clear any previous data on error
      setApiData([]);
      setTotals({
        totalDebit: 0,
        totalCredit: 0,
        totalUnderCredit: 0,
        totalDue: 0,
        totalOutstanding: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreditAging();
  }, [fetchCreditAging]);

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
                <div className="hidden lg:grid grid-cols-11 gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
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
                  ) : apiData.length > 0 ? (
                    apiData.map((row, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-11 items-center gap-6 px-6 py-3 text-sm bg-white hover:bg-gray-50 transition"
                      >
                        <div>{idx + 1}</div>
                        <div>{row.customerName}</div>
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
                         {row.due?.toLocaleString()}
                        </div>
                        <div className="text-blue-600 font-semibold">
                          {row.outstanding.toLocaleString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Show empty state when no data
                    <div className="px-6 py-8 text-center text-gray-500">
                      No credit aging data available
                    </div>
                  )}
                </div>

                {/* Totals Row */}
                <div className="grid grid-cols-11 gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-700 whitespace-nowrap">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div className="text-blue-600">
                    Total Deb: {totals.totalDebit.toLocaleString()}
                  </div>
                  <div className="text-green-600">
                    Total Cred: {totals.totalCredit.toLocaleString()}
                  </div>
                  <div className="text-orange-600">
                    Total Under Cred: {totals.totalUnderCredit.toLocaleString()}
                  </div>
                  <div className="text-red-600">
                    Total Due: {totals.totalDue.toLocaleString()}
                  </div>
                  <div className="text-blue-800">
                    Total Outstand: {totals.totalOutstanding.toLocaleString()}
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