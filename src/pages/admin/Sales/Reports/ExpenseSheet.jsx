import React, { useState, useEffect, useRef } from "react";
import { SquarePen, Trash2, X, Eye } from "lucide-react";
import gsap from "gsap";
import toast from "react-hot-toast";
import { ScaleLoader } from "react-spinners";
import CommanHeader from "../../Components/CommanHeader";

const ExpensePage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "2025-11-07",
      salesman: "Ali Khan",
      items: [
        { name: "Food", amount: 120 },
        { name: "Transport", amount: 80 },
      ],
      totalAmount: 200,
    },
    {
      id: 2,
      date: "2025-11-06",
      salesman: "Zain Ahmed",
      items: [
        { name: "Stationery", amount: 50 },
        { name: "Snacks", amount: 30 },
      ],
      totalAmount: 80,
    },
  ]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [viewExpense, setViewExpense] = useState(null);

  // Dummy salesman list
  const salesmanListData = ["John Doe", "Jane Smith", "Ali Khan"];
  const sliderRef = useRef(null);

  const [expenseItems, setExpenseItems] = useState([
    // example: { name: "Food", amount: 100 }
  ]);

  const handleRemoveItem = (indexToRemove) => {
    setExpenseItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    let filtered = expenses;

    if (selectedSalesman) {
      filtered = filtered.filter(
        (exp) => exp.salesman === selectedSalesman
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (exp) => exp.date === selectedDate
      );
    }

    setFilteredExpenses(filtered);
  }, [selectedSalesman, selectedDate, expenses]);

  // Dummy salesman list
  const salesmanList = [
    { _id: "s1", name: "Ali Khan" },
    { _id: "s2", name: "Zain Ahmed" },
    { _id: "s3", name: "Sara Malik" },
    { _id: "s4", name: "Usman Tariq" },
  ];

  // GSAP Animation
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

  // Add expense item
  const handleAddExpenseItem = () => {
    if (!expenseName || !amount) {
      toast.error("Please enter expense name and amount!");
      return;
    }

    const newItem = {
      name: expenseName,
      amount: parseFloat(amount),
    };
    setExpenseItems([...expenseItems, newItem]);
    setExpenseName("");
    setAmount("");
  };

  // Handle save expense
  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!expenseDate || !selectedSalesman || expenseItems.length === 0) {
      toast.error("Please complete all fields!");
      return;
    }

    const newExpense = {
      id: Date.now(),
      date: expenseDate,
      salesman: salesmanList.find((s) => s._id === selectedSalesman)?.name,
      items: expenseItems,
      totalAmount: expenseItems.reduce((sum, item) => sum + item.amount, 0),
    };

    if (editingExpense) {
      setExpenses(
        filteredExpenses.map((exp) => (exp.id === editingExpense.id ? newExpense : exp))
      );
      toast.success("Expense updated successfully!");
    } else {
      setExpenses([...expenses, newExpense]);
      toast.success("Expense added successfully!");
    }

    setIsSliderOpen(false);
    setExpenseDate("");
    setSelectedSalesman("");
    setExpenseItems([]);
    setEditingExpense(null);
  };

  const handleEdit = (exp) => {
    setEditingExpense(exp);
    setExpenseDate(exp.date);
    setSelectedSalesman(
      salesmanList.find((s) => s.name === exp.salesman)?._id || ""
    );
    setExpenseItems(exp.items);
    setIsSliderOpen(true);
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
    toast.success("Expense deleted!");
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="px-6 mx-auto">
        <CommanHeader />
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-newPrimary">Expenses Sheet</h1>
        </div>
        {isSaving && (
          <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-[9999]">
            <ScaleLoader color="#1E93AB" size={60} />
          </div>
        )}

        <div className="flex gap-4 mb-5">
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
                <option key={item._id} value={item.name}>
                  {item.name}
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

        {/* ===== TABLE ===== */}
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="hidden lg:grid grid-cols-[80px_150px_150px_1fr_150px_150px] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase border-b">
                <div>Sr</div>
                <div>Date</div>
                <div>Salesman</div>
                <div>Expenses</div>
                <div>Amount</div>
                <div className="text-center">Actions</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No expenses found.
                  </div>
                ) : (
                  filteredExpenses.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="grid grid-cols-1 lg:grid-cols-[80px_150px_150px_1fr_150px_150px] gap-4 items-center px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div>{index + 1}</div>
                      <div>{exp.date}</div>
                      <div>{exp.salesman}</div>
                      <div>{exp.items.map((i) => i.name).join(", ")}</div>
                      <div className="font-semibold text-blue-600">
                        {exp.totalAmount}
                      </div>
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setViewExpense(exp)} className="text-yellow-500 hover:text-yellow-600">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleEdit(exp)} className="text-blue-600 hover:text-blue-800">
                          <SquarePen size={18} />
                        </button>
                        <button onClick={() => handleDelete(exp.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {viewExpense && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-newPrimary mb-4">Expense Details</h2>
              <p><strong>Date:</strong> {viewExpense.date}</p>
              <p><strong>Salesman:</strong> {viewExpense.salesman}</p>
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
