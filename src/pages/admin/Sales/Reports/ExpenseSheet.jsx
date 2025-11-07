import React, { useState, useEffect } from "react";
import axios from "axios";
import { SquarePen, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { ScaleLoader } from "react-spinners";
import CommanHeader from "../../Components/CommanHeader";

const ExpensePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [salesmanList, setSalesmanList] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [viewExpense, setViewExpense] = useState(null);
const [expenseAmount, setExpenseAmount] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // ✅ Fetch Salesman List
  useEffect(() => {
    const fetchSalesmen = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/employees`);
        setSalesmanList(data || []);
      } catch (error) {
        toast.error("Failed to load salesmen");
      }
    };
    fetchSalesmen();
  }, []);

  // ✅ Fetch Expenses based on salesman/date
  const fetchExpenses = async () => {
    try {
      if (!selectedSalesman) {
        setExpenses([]);
        return;
      }

      setIsLoading(true);
      const dateQuery = selectedDate
        ? `?date=${selectedDate}`
        : ""; // Optional date

      const { data } = await axios.get(
        `${API_BASE}/salesman-expense/salesman/${selectedSalesman}${dateQuery}`
      );

      if (data.success) {
        const mapped = data.data.map((exp) => ({
          id: exp._id,
          date: exp.date.split("T")[0],
          salesman: exp.salesmanId?.employeeName || "N/A",
          items: exp.expenses.map((e) => ({
            name: e.expenseName,
            amount: e.amount,
          })),
          totalAmount: exp.totalAmount,
          
        }));
        setExpenses(mapped);
        setExpenseAmount(data.totalExpense || 0);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      toast.error("Failed to fetch expenses");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Auto load today's date and data
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  // ✅ Auto-refresh when salesman or date changes
  useEffect(() => {
    if (selectedSalesman) fetchExpenses();
  }, [selectedSalesman, selectedDate]);
console.log({expenses});

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="px-6 mx-auto">
        <CommanHeader />
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-newPrimary">Expenses Sheet</h1>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-[9999]">
            <ScaleLoader color="#1E93AB" size={60} />
          </div>
        )}

        {/* 🔹 Filters */}
        <div className="flex justify-between items-center w-full gap-4 mb-5">
          <div className="flex gap-4">
                {/* Salesman Selection */}
          <div className="w-[300px]">
            <label className="block text-gray-700 font-medium mb-2">
              Select Salesman *
            </label>
            <select
              value={selectedSalesman}
              onChange={(e) => setSelectedSalesman(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
            >
              <option value="">Choose Salesman</option>
              {salesmanList.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.employeeName}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div className="w-[300px]">
            <label className="block text-gray-700 font-medium mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
            />
          </div>
          </div>
           {selectedSalesman && (
             <div className="w-[200px] whitespace-nowrap">
                 <label className=" text-newPrimary inline-flex gap-2 items-center font-medium mb-2">Today Expense Amount: <p className="text-black ">{expenseAmount}</p></label>
{/* 
            <input
              type="text"
              value={expenseAmount}
             disabled
              className="w-full p-3 border h-[40px] border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
            /> */}
          </div>
           )}
         
        
        </div>

        {/* ===== TABLE ===== */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="hidden lg:grid grid-cols-[80px_150px_150px_1fr_150px_150px] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase border-b">
                <div>Sr</div>
                <div>Date</div>
                <div className="text-center">Salesman</div>
                <div className="text-center">Expenses</div>
                <div>Amount</div>
                <div className="text-center">Actions</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {expenses.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No expenses found.
                  </div>
                ) : (
                  expenses.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="grid grid-cols-1 lg:grid-cols-[80px_150px_150px_1fr_150px_150px] gap-4 items-center px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div  >{index + 1}</div>
                      <div>{exp.date}</div>
                      <div className="text-center">{exp.salesman}</div>
                      <div className="text-center">{exp.items.map((i) => i.name).join(", ")}</div>
                      <div className="font-semibold text-blue-600">{exp.totalAmount}</div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setViewExpense(exp)}
                          className="text-yellow-500 hover:text-yellow-600"
                        >
                          <Eye size={18} />
                        </button>
                      
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== VIEW MODAL ===== */}
        {viewExpense && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-newPrimary mb-4">Expense Details</h2>
              <p>
                <strong>Date:</strong> {viewExpense.date}
              </p>
              <p>
                <strong>Salesman:</strong> {viewExpense.salesman}
              </p>
              <div className="mt-3">
                <h3 className="font-semibold mb-2">Items:</h3>
                <ul className="space-y-1">
                  {viewExpense.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span>{item.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 font-semibold text-blue-600">
                Total Amount: {viewExpense.totalAmount}
              </p>
              <button
                onClick={() => setViewExpense(null)}
                className="mt-6 w-full bg-newPrimary text-white py-2 rounded-lg hover:bg-newPrimary/80"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensePage;
