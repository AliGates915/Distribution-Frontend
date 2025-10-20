
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import axios from "axios";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import ViewModel from "../../../../helper/ViewModel";

// Static data for fallback
const staticLoads = [
  {
    _id: "1",
    loadNo: "LOAD-001",
    loadDate: "2025-10-01",
    salesmanName: "Ali Khan",
    vehicleNo: "ABC-123",
    products: [
      { sr: 1, category: "Beverages", item: "Pepsi 1.5L", pack: "carton", issues: 20, price: 150, amount: 3000 },
      { sr: 2, category: "Snacks", item: "Lays Chips 50g", pack: "bag", issues: 50, price: 60, amount: 3000 },
      { sr: 3, category: "Biscuits", item: "Oreo 100g", pack: "piece", issues: 30, price: 80, amount: 2400 },
    ],
    prevBalance: 10000,
    totalQty: 100,
    totalAmount: 8400,
    isEnable: true,
  },
  {
    _id: "2",
    loadNo: "LOAD-002",
    loadDate: "2025-10-05",
    salesmanName: "Hamza Raza",
    vehicleNo: "XYZ-456",
    products: [
      { sr: 1, category: "Dairy", item: "Milk Pack 1L", pack: "carton", issues: 15, price: 220, amount: 3300 },
      { sr: 2, category: "Bakery", item: "Bread Large", pack: "piece", issues: 25, price: 100, amount: 2500 },
      { sr: 3, category: "Beverages", item: "7up 500ml", pack: "carton", issues: 10, price: 140, amount: 1400 },
      { sr: 4, category: "Snacks", item: "Kurkure 25g", pack: "bag", issues: 60, price: 40, amount: 2400 },
    ],
    prevBalance: 5000,
    totalQty: 110,
    totalAmount: 9600,
    isEnable: true,
  },
];

const staticSalesmen = [
  {
    _id: "s1",
    salesmanName: "Ali Khan",
    vehicleNo: "ABC-123",
    prevBalance: 10000,
    products: [
      { _id: "p1", category: "Beverages", itemName: "Pepsi 1.5L", pack: "carton", issues: 20, price: 150, amount: 3000 },
      { _id: "p2", category: "Snacks", itemName: "Lays Chips 50g", pack: "bag", issues: 50, price: 60, amount: 3000 },
      { _id: "p3", category: "Biscuits", itemName: "Oreo 100g", pack: "piece", issues: 30, price: 80, amount: 2400 },
    ],
  },
  {
    _id: "s2",
    salesmanName: "Hamza Raza",
    vehicleNo: "XYZ-456",
    prevBalance: 5000,
    products: [
      { _id: "p4", category: "Dairy", itemName: "Milk Pack 1L", pack: "carton", issues: 15, price: 220, amount: 3300 },
      { _id: "p5", category: "Bakery", itemName: "Bread Large", pack: "piece", issues: 25, price: 100, amount: 2500 },
      { _id: "p6", category: "Beverages", itemName: "7up 500ml", pack: "carton", issues: 10, price: 140, amount: 1400 },
      { _id: "p7", category: "Snacks", itemName: "Kurkure 25g", pack: "bag", issues: 60, price: 40, amount: 2400 },
    ],
  },
];

const staticItems = [
  { _id: "p1", category: "Beverages", itemName: "Pepsi 1.5L", pack: "carton", issues: 20, price: 150, amount: 3000 },
  { _id: "p2", category: "Snacks", itemName: "Lays Chips 50g", pack: "bag", issues: 50, price: 60, amount: 3000 },
  { _id: "p3", category: "Biscuits", itemName: "Oreo 100g", pack: "piece", issues: 30, price: 80, amount: 2400 },
  { _id: "p4", category: "Dairy", itemName: "Milk Pack 1L", pack: "carton", issues: 15, price: 220, amount: 3300 },
  { _id: "p5", category: "Bakery", itemName: "Bread Large", pack: "piece", issues: 25, price: 100, amount: 2500 },
  { _id: "p6", category: "Beverages", itemName: "7up 500ml", pack: "carton", issues: 10, price: 140, amount: 1400 },
  { _id: "p7", category: "Snacks", itemName: "Kurkure 25g", pack: "bag", issues: 60, price: 40, amount: 2400 },
];

const Loadsheet = () => {
  const [loads, setLoads] = useState([]);
  const [salesmenOptions, setSalesmenOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadNo, setLoadNo] = useState("");
  const [loadDate, setLoadDate] = useState("");
  const [salesman, setSalesman] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [category, setCategory] = useState("");
  const [item, setItem] = useState("");
  const [pack, setPack] = useState("");
  const [issues, setIssues] = useState("");
  const [totalQty, setTotalQty] = useState(0);
  const [prevBalance, setPrevBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isEnable, setIsEnable] = useState(true);
  const [isView, setIsView] = useState(false);
  const [editingLoad, setEditingLoad] = useState(null);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const sliderRef = useRef(null);
  const [nextLoadNo, setNextLoadNo] = useState("001");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Handle adding items to the table in the form
  const handleAddItem = () => {
    if (!category || !item || !pack || !issues) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "⚠️ Please fill in Category, Item, Pack, and Issues.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const selectedOption = itemOptions.find((opt) => opt._id === item);
    const newItem = {
      sr: itemsList.length + 1,
      category,
      item: selectedOption?.itemName || "",
      pack,
      issues: parseInt(issues, 10),
      price: selectedOption?.price || 0,
      amount: selectedOption?.price * parseInt(issues, 10) || 0,
    };

    const updatedItemsList = [...itemsList, newItem];
    setItemsList(updatedItemsList);

    // Update totalQty and totalAmount
    const newTotalQty = updatedItemsList.reduce((sum, it) => sum + it.issues, 0);
    const newTotalAmount = updatedItemsList.reduce((sum, it) => sum + it.amount, 0);
    setTotalQty(newTotalQty);
    setTotalAmount(newTotalAmount);

    // Clear form
    setCategory("");
    setItem("");
    setPack("");
    setIssues("");
  };

  // Fetch salesmen options
  const fetchSalesmenOptions = useCallback(async () => {
    try {
      setLoading(true);
      const { token } = userInfo || {};
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/salesmen`, { headers });
      setSalesmenOptions(res.data.length ? res.data : staticSalesmen);
    } catch (error) {
      console.error("Failed to fetch salesmen:", error);
      toast.error("Failed to fetch salesmen. Using static data.");
      setSalesmenOptions(staticSalesmen);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesmenOptions();
  }, [fetchSalesmenOptions]);

  // Fetch item options
  const fetchItemOptions = useCallback(async () => {
    try {
      setLoading(true);
      const { token } = userInfo || {};
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/items`, { headers });
      setItemOptions(res.data.length ? res.data : staticItems);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      toast.error("Failed to fetch items. Using static data.");
      setItemOptions(staticItems);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItemOptions();
  }, [fetchItemOptions]);

  // Fetch loads
  const fetchLoads = useCallback(async () => {
    try {
      setLoading(true);
      const { token } = userInfo || {};
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/loadsheets`, { headers });
      console.log("Loadsheet API Response:", res.data); // Debug API response
      const transformedLoads = (res.data.length ? res.data : staticLoads).map((load) => ({
        _id: load._id,
        loadNo: load.loadNo || "N/A",
        loadDate: load.loadDate || null,
        salesmanName: load.salesmanName || "N/A",
        vehicleNo: load.vehicleNo || "N/A",
        products: load.products || [],
        prevBalance: load.prevBalance || 0,
        totalQty: load.totalQty || 0,
        totalAmount: load.totalAmount || 0,
        isEnable: load.isEnable !== undefined ? load.isEnable : true,
      }));
      setLoads(transformedLoads);
    } catch (error) {
      console.error("Failed to fetch loadsheets:", error);
      toast.error("Failed to fetch loadsheets. Using static data.");
      const transformedLoads = staticLoads.map((load) => ({
        _id: load._id,
        loadNo: load.loadNo || "N/A",
        loadDate: load.loadDate || null,
        salesmanName: load.salesmanName || "N/A",
        vehicleNo: load.vehicleNo || "N/A",
        products: load.products || [],
        prevBalance: load.prevBalance || 0,
        totalQty: load.totalQty || 0,
        totalAmount: load.totalAmount || 0,
        isEnable: load.isEnable !== undefined ? load.isEnable : true,
      }));
      setLoads(transformedLoads);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoads();
  }, [fetchLoads]);

  // Debug loads state
  useEffect(() => {
    console.log("Current loads state:", loads);
  }, [loads]);

  // Next Load No
  useEffect(() => {
    if (loads.length > 0) {
      const maxNo = Math.max(
        ...loads.map((l) => {
          const match = l.loadNo?.match(/LOAD-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextLoadNo((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextLoadNo("001");
    }
  }, [loads]);

  // Handlers for form and table actions
  const handleAddClick = () => {
    setEditingLoad(null);
    setLoadNo("");
    setLoadDate("");
    setSalesman("");
    setVehicleNo("");
    setItemsList([]);
    setCategory("");
    setItem("");
    setPack("");
    setIssues("");
    setTotalQty(0);
    setPrevBalance(0);
    setAmount(0);
    setTotalAmount(0);
    setIsEnable(true);
    setIsSliderOpen(true);
  };

  const handleEditClick = (load) => {
    setEditingLoad(load);
    setLoadNo(load.loadNo);
    setLoadDate(formatDate(load.loadDate));
    const selectedSalesman = salesmenOptions.find((sm) => sm.salesmanName === load.salesmanName);
    setSalesman(selectedSalesman?._id || "");
    setVehicleNo(load.vehicleNo || "");
    setItemsList(
      (load.products || []).map((it) => ({
        sr: it.sr,
        category: it.category,
        item: it.item,
        pack: it.pack,
        issues: it.issues,
        price: it.price,
        amount: it.amount,
      }))
    );
    setTotalQty(load.totalQty || 0);
    setPrevBalance(load.prevBalance || 0);
    setAmount(load.products?.reduce((sum, it) => sum + it.amount, 0) || 0);
    setTotalAmount(load.totalAmount || 0);
    setIsEnable(load.isEnable);
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loadDate || !salesman) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "⚠️ Please fill in Load Date and Salesman.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const { token } = userInfo || {};
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const newLoad = {
      loadNo: editingLoad ? loadNo : `LOAD-${nextLoadNo}`,
      loadDate,
      salesmanName: salesmenOptions.find((sm) => sm._id === salesman)?.salesmanName || "",
      vehicleNo,
      products: itemsList.map((item, idx) => ({
        sr: idx + 1,
        category: item.category,
        item: item.item,
        pack: item.pack,
        issues: item.issues,
        price: item.price,
        amount: item.amount,
      })),
      prevBalance,
      totalQty,
      totalAmount,
    };

    try {
      if (editingLoad) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/loadsheets/${editingLoad._id}`,
          newLoad,
          { headers }
        );
        Swal.fire("Updated!", "Loadsheet updated successfully.", "success");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/loadsheets`,
          newLoad,
          { headers }
        );
        Swal.fire("Added!", "Loadsheet added successfully.", "success");
      }

      fetchLoads();
      setIsSliderOpen(false);
      setItemsList([]);
    } catch (error) {
      console.error("Error saving loadsheet:", error);
      Swal.fire("Error!", "Something went wrong while saving.", "error");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "Invalid Date";
    const day = String(parsed.getDate()).padStart(2, "0");
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const year = parsed.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleDelete = async (id) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "space-x-2",
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300",
      },
      buttonsStyling: false,
    });

    swalWithTailwindButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const { token } = userInfo || {};
            const headers = {
              Authorization: `Bearer ${token}`,
            };
            await axios.delete(
              `${import.meta.env.VITE_API_BASE_URL}/loadsheets/${id}`,
              { headers }
            );
            setLoads(loads.filter((l) => l._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Loadsheet deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete loadsheet.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire("Cancelled", "Loadsheet is safe 🙂", "error");
        }
      });
  };

  const handleView = (load) => {
    setSelectedLoad(load);
    setIsView(true);
  };

  const handleSalesmanChange = (e) => {
    const selectedId = e.target.value;
    setSalesman(selectedId);
    setItemsList([]);
    const selectedSalesman = salesmenOptions.find((sm) => sm._id === selectedId);
    if (selectedSalesman) {
      setVehicleNo(selectedSalesman.vehicleNo || "");
      setPrevBalance(selectedSalesman.prevBalance || 0);
      const salesmanItems = selectedSalesman.products?.map((it, idx) => ({
        _id: it._id,
        category: it.category,
        itemName: it.itemName,
        pack: it.pack,
        issues: it.issues,
        price: it.price,
        amount: it.amount,
      })) || [];
      setItemOptions(salesmanItems);
      const newTotalQty = salesmanItems.reduce((sum, it) => sum + it.issues, 0);
      const newTotalAmount = salesmanItems.reduce((sum, it) => sum + it.amount, 0);
      setTotalQty(newTotalQty);
      setTotalAmount(newTotalAmount);
    } else {
      setVehicleNo("");
      setPrevBalance(0);
      setTotalQty(0);
      setTotalAmount(0);
      setItemOptions(staticItems);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Loadsheet Details
            </h1>
          </div>
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
            onClick={handleAddClick}
          >
            + Add Loadsheet
          </button>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="inline-block min-w-[1200px] w-full align-middle">
                <div className="hidden lg:grid grid-cols-6 gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                  <div>SR#</div>
                  <div>Category</div>
                  <div>Item</div>
                  <div>Pack</div>
                  <div>Issues</div>
                  <div className="text-right">Actions</div>
                </div>

                <div className="flex flex-col divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton rows={5} cols={6} className="lg:grid-cols-6" />
                  ) : loads.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 bg-white">
                      No loadsheets found.
                    </div>
                  ) : (
                    loads.flatMap((load) =>
                      load.products.map((product, idx) => (
                        <div
                          key={`${load._id}-${product.sr}`}
                          className="grid grid-cols-1 lg:grid-cols-6 items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                        >
                          <div className="font-medium text-gray-900">{product.sr}</div>
                          <div className="text-gray-600">{product.category || "N/A"}</div>
                          <div className="text-gray-600">{product.item || "N/A"}</div>
                          <div className="text-gray-600">{product.pack || "N/A"}</div>
                          <div className="text-gray-600">{product.issues || "N/A"}</div>
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleEditClick(load)}
                              className="py-1 text-sm rounded text-blue-600"
                              title="Edit"
                            >
                              <SquarePen size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(load._id)}
                              className="py-1 text-sm text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button
                              onClick={() => handleView(load)}
                              className="text-amber-600 hover:underline"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            </div>
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
                  {editingLoad ? "Update Loadsheet" : "Add a New Loadsheet"}
                </h2>
                <button
                  className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                  onClick={() => {
                    setIsSliderOpen(false);
                    setLoadNo("");
                    setLoadDate("");
                    setSalesman("");
                    setVehicleNo("");
                    setItemsList([]);
                    setCategory("");
                    setItem("");
                    setPack("");
                    setIssues("");
                    setTotalQty(0);
                    setPrevBalance(0);
                    setAmount(0);
                    setTotalAmount(0);
                    setIsEnable(true);
                    setEditingLoad(null);
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Load No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingLoad ? loadNo : `LOAD-${nextLoadNo}`}
                      onChange={(e) => setLoadNo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter Load No."
                      readOnly={!!editingLoad}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Load Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={loadDate}
                      onChange={(e) => setLoadDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Salesman <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={salesman}
                      onChange={handleSalesmanChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      required
                    >
                      <option value="">Select Salesman</option>
                      {salesmenOptions.map((sm) => (
                        <option key={sm._id} value={sm._id}>
                          {sm.salesmanName || "N/A"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Vehicle No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={vehicleNo}
                      readOnly
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-100"
                      placeholder="Vehicle No."
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Total Qty
                    </label>
                    <input
                      type="number"
                      value={totalQty}
                      readOnly
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-100"
                      placeholder="Total Qty"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Prev Balance
                    </label>
                    <input
                      type="number"
                      value={prevBalance}
                      readOnly
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-100"
                      placeholder="Prev Balance"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount}
                      readOnly
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-100"
                      placeholder="Amount"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      value={totalAmount}
                      readOnly
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-100"
                      placeholder="Total Amount"
                    />
                  </div>
                </div>

                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      >
                        <option value="">Select Category</option>
                        {[...new Set(itemOptions.map((opt) => opt.category))].map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">
                        Item
                      </label>
                      <select
                        value={item}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setItem(selectedId);
                          const selectedOption = itemOptions.find((opt) => opt._id === selectedId);
                          if (selectedOption) {
                            setPack(selectedOption.pack || "");
                            setIssues(selectedOption.issues || "");
                            setAmount(selectedOption.amount || 0);
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      >
                        <option value="">Select Item</option>
                        {itemOptions
                          .filter((opt) => !category || opt.category === category)
                          .map((opt) => (
                            <option key={opt._id} value={opt._id}>
                              {opt.itemName}
                            </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">
                        Pack
                      </label>
                      <input
                        type="text"
                        value={pack}
                        onChange={(e) => setPack(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter Pack"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">
                        Issues
                      </label>
                      <input
                        type="number"
                        value={issues}
                        onChange={(e) => setIssues(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter Issues"
                        min="1"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="w-40 h-12 bg-newPrimary text-white rounded-lg hover:bg-newPrimary/80 transition"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                  {itemsList.length > 0 && (
                    <div className="overflow-x-auto">
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                          <thead className="bg-gray-100 text-gray-600 text-sm">
                            <tr>
                              <th className="px-4 py-2 border border-gray-300">Sr #</th>
                              <th className="px-4 py-2 border border-gray-300">Category</th>
                              <th className="px-4 py-2 border border-gray-300">Item</th>
                              <th className="px-4 py-2 border border-gray-300">Pack</th>
                              <th className="px-4 py-2 border border-gray-300">Issues</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700 text-sm">
                            {itemsList.map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 text-center">
                                <td className="px-4 py-2 border border-gray-300 text-center">{item.sr}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.category}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.item}</td>
                                <td className="px-4 py-2 border border-gray-300">{item.pack}</td>
                                <td className="px-4 py-2 border border-gray-300 text-center">{item.issues}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                >
                  {loading ? "Saving..." : editingLoad ? "Update Loadsheet" : "Save Loadsheet"}
                </button>
              </form>
            </div>
          </div>
        )}

        {isView && selectedLoad && (
          <ViewModel
            data={selectedLoad}
            type="loadsheet"
            onClose={() => setIsView(false)}
          />
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

export default Loadsheet;