import React, { useState, useEffect, useRef } from "react";
import { SquarePen, Trash2, X } from "lucide-react";
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
  const [expenseDate, setExpenseDate] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

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
        expenses.map((exp) => (exp.id === editingExpense.id ? newExpense : exp))
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

        {isSaving && (
          <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-[9999]">
            <ScaleLoader color="#1E93AB" size={60} />
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">All Expenses</h1>
            <p className="text-gray-500 text-sm">
              Manage your daily expense records
            </p>
          </div>
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
            onClick={() => setIsSliderOpen(true)}
          >
            + Add Expense
          </button>
        </div>

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
                      <div>{index + 1}</div>
                      <div>{exp.date}</div>
                      <div>{exp.salesman}</div>
                      <div>{exp.items.map((i) => i.name).join(", ")}</div>
                      <div className="font-semibold text-blue-600">
                        {exp.totalAmount}
                      </div>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(exp)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="text-red-600 hover:text-red-800"
                        >
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

        {/* ===== SLIDER FORM ===== */}
        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="relative w-full md:w-[550px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingExpense ? "Update Expense" : "Add New Expense"}
                </h2>
                <button
                  className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                  onClick={() => {
                    setIsSliderOpen(false);
                    setEditingExpense(null);
                    setExpenseDate("");
                    setSelectedSalesman("");
                    setExpenseItems([]);
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveExpense} className="space-y-4 p-6">
                {/* Date */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                  />
                </div>

                {/* Salesman */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Salesman <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedSalesman}
                    onChange={(e) => setSelectedSalesman(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                  >
                    <option value="">Select Salesman</option>
                    {salesmanList.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expense Fields */}
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                  {/* Input Row */}
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Expense Name"
                      value={expenseName}
                      onChange={(e) => setExpenseName(e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-32 p-2 border rounded"
                    />
                    <button
                      type="button"
                      onClick={handleAddExpenseItem}
                      className="bg-newPrimary text-white px-3 py-2 rounded hover:bg-newPrimary/80"
                    >
                      Add
                    </button>
                  </div>

                  {/* Expense Table */}
                  <div>
                    {expenseItems.length > 0 && (
                      <div className="mt-4">
                        <div className="grid grid-cols-4 font-semibold text-gray-700 border-b pb-2">
                          <span>Sr</span>
                          <span>Expense</span>
                          <span>Amount</span>
                          <span className="text-center">Action</span>
                        </div>

                        {expenseItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-sm text-gray-700 py-2 border-b last:border-b-0"
                          >
                            <span className="w-1/12 text-left">{idx + 1}</span>
                            <span className="w-5/12 text-center">
                              {item.name}
                            </span>
                            <span className="w-3/12 text-left">
                              {item.amount}
                            </span>
                            <span className="w-3/12 flex justify-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="text-red-600 hover:bg-red-100 rounded-full transition"
                                title="Remove Item"
                              >
                                <X size={18} />
                              </button>
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition"
                >
                  {editingExpense ? "Update Expense" : "Save Expense"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensePage;
