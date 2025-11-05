import React, { useState, useEffect, useRef, useCallback } from "react";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import axios from "axios";
import CommanHeader from "../../Components/CommanHeader";
import TableSkeleton from "../../Components/Skeleton";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import ViewModel from "../../../../helper/ViewModel";

// Static data for fallback
const staticGrns = [
  {
    _id: "1",
    grnId: "GRN-001",
    qcId: "QC-001",
    supplier: {
      supplierName: "ABC Suppliers",
      address: "123 Main St, City",
      phoneNumber: "+1234567890",
    },
    date: "2025-10-01",
    items: [
      {
        itemName: "Widget A",
        quantity: 10,
        description: "High-quality widget",
      },
      { itemName: "Widget B", quantity: 5, description: "Standard widget" },
    ],
    isEnable: true,
  },
  {
    _id: "2",
    grnId: "GRN-002",
    qcId: "QC-002",
    supplier: {
      supplierName: "XYZ Corp",
      address: "456 Oak Ave, Town",
      phoneNumber: "+0987654321",
    },
    date: "2025-10-05",
    items: [
      { itemName: "Gadget X", quantity: 20, description: "Premium gadget" },
    ],
    isEnable: true,
  },
];

const staticGatePassOptions = [
  {
    _id: "qc1",
    qcId: "QC-001",
    supplier: {
      supplierName: "ABC Suppliers",
      address: "123 Main St, City",
      phoneNumber: "+1234567890",
    },
    items: [
      { _id: "item1", itemName: "Widget A", quantity: 10 },
      { _id: "item2", itemName: "Widget B", quantity: 5 },
    ],
  },
  {
    _id: "qc2",
    qcId: "QC-002",
    supplier: {
      supplierName: "XYZ Corp",
      address: "456 Oak Ave, Town",
      phoneNumber: "+0987654321",
    },
    items: [{ _id: "item3", itemName: "Gadget X", quantity: 20 }],
  },
];

const staticItemOptions = [
  { _id: "item1", itemName: "Widget A", quantity: 10 },
  { _id: "item2", itemName: "Widget B", quantity: 5 },
  { _id: "item3", itemName: "Gadget X", quantity: 20 },
];

const GRN = () => {
  const [grns, setGrns] = useState([]);
  const [records, setRecords] = useState([]);
  const [salesmanList, setSalesmanList] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [balance, setBalance] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [gatePassOptions, setGatePassOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [grnId, setGrnId] = useState("");
  const [date, setDate] = useState("");
  const [gatePassIn, setGatePassIn] = useState("");
  const [supplier, setSupplier] = useState("");
  const [isEnable, setIsEnable] = useState(true);
  const [isView, setIsView] = useState(false);
  const [editingGrn, setEditingGrn] = useState(null);
  const [selectedGrn, setSelectedGrn] = useState(null);
  const sliderRef = useRef(null);
  const [nextGRNId, setNextGrnId] = useState("001");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [discount, setDiscount] = useState(0);


  const userInfo = JSON.parse(localStorage.getItem("userInfo"));


  // 🔹 Fetch Salesman List
  const fetchSalesmen = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employees`
      );
      setSalesmanList(res.data || []);
    } catch (error) {
      console.error("Error fetching salesmen:", error);
      toast.error("Failed to load salesmen");
    } finally {
      setLoading(false);
    }
  }, []);


  // 🔹 Fetch Item Options
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/item-details/order-taker`
      );
      setItemOptions(res.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesmen();
    fetchItems();
  }, [fetchSalesmen, fetchItems]);

  // 🔹 Handle Salesman Select
  const handleSalesmanChange = (e) => {
    const salesmanId = e.target.value;
    setSelectedSalesman(salesmanId);
    const selected = salesmanList.find((s) => s._id === salesmanId);
    if (selected) {
      setBalance(selected.recoveryBalance || 0);
      setPhone(selected.mobile || "N/A");
      setAddress(selected.address || "N/A");
    }
  };

  const handleItemsChange = (e) => {
    const itemId = e.target.value;
    setItem(itemId);

    const selected = itemOptions.find((opt) => opt._id === itemId);
    if (selected) {
      setRate(selected.purchase || 0); // ✅ auto set rate from purchase field
    }
  };





  // Fetch gate pass options
  const fetchGatePassOptions = useCallback(async () => {
    try {
      setLoading(true);
      const { token } = userInfo || {};
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/qualityCheck/supplierQC`,
        { headers }
      );
      setGatePassOptions(res.data.length ? res.data : staticGatePassOptions);
    } catch (error) {
      console.error("Failed to fetch gate pass options:", error);
      toast.error("Failed to fetch gate pass options. Using static data.");
      setGatePassOptions(staticGatePassOptions);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGatePassOptions();
  }, [fetchGatePassOptions]);

  // Fetch item options
  const fetchItemOptions = useCallback(async () => {
    try {
      setLoading(true);
      const { token } = userInfo || {};
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/items`,
        {
          headers,
        }
      );
      setItemOptions(res.data.length ? res.data : staticItemOptions);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      toast.error("Failed to fetch items. Using static data.");
      setItemOptions(staticItemOptions);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItemOptions();
  }, [fetchItemOptions]);

  // Fetch GRNs
  const fetchGrns = useCallback(async () => {
    try {
      setLoading(true);
      const { token } = userInfo || {};
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/grn`, {
        headers,
      });
      console.log("GRN API Response:", res.data); // Debug API response
      const transformedGrns = (res.data.length ? res.data : staticGrns).map(
        (grn) => ({
          _id: grn._id,
          grnId: grn.grnId || "N/A",
          qcId: grn.qcId || "N/A",
          supplier: {
            supplierName: grn.supplier?.supplierName || "N/A",
            address: grn.supplier?.address || "N/A",
            phoneNumber: grn.supplier?.phoneNumber || "N/A",
          },
          date: grn.date || null,
          items: grn.items || [],
          isEnable: grn.isEnable !== undefined ? grn.isEnable : true,
        })
      );
      setGrns(transformedGrns);
    } catch (error) {
      console.error("Failed to fetch GRNs:", error);
      toast.error("Failed to fetch GRNs. Using static data.");
      const transformedGrns = staticGrns.map((grn) => ({
        _id: grn._id,
        grnId: grn.grnId || "N/A",
        qcId: grn.qcId || "N/A",
        supplier: {
          supplierName: grn.supplier?.supplierName || "N/A",
          address: grn.supplier?.address || "N/A",
          phoneNumber: grn.supplier?.phoneNumber || "N/A",
        },
        date: grn.date || null,
        items: grn.items || [],
        isEnable: grn.isEnable !== undefined ? grn.isEnable : true,
      }));
      setGrns(transformedGrns);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrns();
  }, [fetchGrns]);

  // Debug grns state
  useEffect(() => {
    console.log("Current grns state:", grns);
  }, [grns]);

  // Next GRN ID
  useEffect(() => {
    if (grns.length > 0) {
      const maxNo = Math.max(
        ...grns.map((r) => {
          const match = r.grnId?.match(/GRN-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
      );
      setNextGrnId((maxNo + 1).toString().padStart(3, "0"));
    } else {
      setNextGrnId("001");
    }
  }, [grns]);

  // Handlers for form and table actions
  const handleAddClick = () => {
    setEditingGrn(null);
    setGrnId("");
    setDate("");
    setGatePassIn("");
    setSupplier("");
    setAddress("");
    setPhone("");
    setItemsList([]);
    setItem("");
    setQty("");
    setDescription("");
    setIsEnable(true);
    setDate(new Date().toISOString().split("T")[0]);
    setIsSliderOpen(true);
  };

  const handleEditClick = (grn) => {
    setEditingGrn(grn);
    setGrnId(grn.grnId);
    setDate(formatDate(grn.date));
    const selectedGatePass = gatePassOptions.find((gp) => gp.qcId === grn.qcId);
    setGatePassIn(selectedGatePass?._id || "");
    setSupplier(grn.supplier?.supplierName || "");
    setAddress(grn.supplier?.address || "");
    setPhone(grn.supplier?.phoneNumber || "");
    setItemsList(
      (grn.items || []).map((it) => ({
        item: it.itemName,
        qty: it.quantity,
        description: it.description,
      }))
    );
    setIsEnable(grn.isEnable);
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !gatePassIn) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "⚠️ Please fill in Date and Gate Pass QC.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const { token } = userInfo || {};
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const newGrn = {
      grnId: editingGrn ? grnId : `GRN-${nextGRNId}`,
      date,
      qcId: gatePassIn,
      items: itemsList.map((item) => ({
        itemName: item.item,
        quantity: item.qty,
        description: item.description,
      })),
    };

    try {
      if (editingGrn) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/grn/${editingGrn._id}`,
          newGrn,
          { headers }
        );
        Swal.fire("Updated!", "GRN updated successfully.", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/grn`, newGrn, {
          headers,
        });
        Swal.fire("Added!", "GRN added successfully.", "success");
      }

      fetchGrns();
      setIsSliderOpen(false);
      setItemsList([]);
    } catch (error) {
      console.error("Error saving GRN:", error);
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
              `${import.meta.env.VITE_API_BASE_URL}/grn/${id}`,
              { headers }
            );
            setGrns(grns.filter((g) => g._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "GRN deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete GRN.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire("Cancelled", "GRN is safe 🙂", "error");
        }
      });
  };

  const handleView = (grn) => {
    setSelectedGrn(grn);
    setIsView(true);
  };

  const handleGatePassChange = (e) => {
    const selectedId = e.target.value;
    setGatePassIn(selectedId);
    setItemsList([]);
    const selectedQC = gatePassOptions.find((gp) => gp._id === selectedId);
    if (selectedQC) {
      setSupplier(selectedQC.supplier?.supplierName || "");
      setAddress(selectedQC.supplier?.address || "");
      setPhone(selectedQC.supplier?.phoneNumber || "");
      const qcItems =
        selectedQC.items?.map((it) => ({
          _id: it._id,
          itemName: it.itemName,
          quantity: it.quantity,
        })) || [];
      setItemOptions(qcItems);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">
              Goods Received Note Details
            </h1>
          </div>
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
            onClick={handleAddClick}
          >
            + Add GRN
          </button>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="inline-block min-w-[1200px] w-full align-middle">
                <div className="hidden lg:grid grid-cols-7 gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                  <div>GRN ID</div>
                  <div>Gate Pass QC</div>
                  <div>Supplier</div>
                  <div>Address</div>
                  <div>Phone</div>
                  <div>Date</div>
                  <div className="text-right">Actions</div>
                </div>

                <div className="flex flex-col divide-y divide-gray-100">
                  {loading ? (
                    <TableSkeleton
                      rows={5}
                      cols={7}
                      className="lg:grid-cols-7"
                    />
                  ) : grns.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 bg-white">
                      No GRNs found.
                    </div>
                  ) : (
                    grns.map((grn) => (
                      <div
                        key={grn._id}
                        className="grid grid-cols-1 lg:grid-cols-7 items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                      >
                        <div className="font-medium text-gray-900">
                          {grn.grnId || "N/A"}
                        </div>
                        <div className="text-gray-600">{grn.qcId || "N/A"}</div>
                        <div className="text-gray-600">
                          {grn.supplier?.supplierName || "N/A"}
                        </div>
                        <div className="text-gray-600">
                          {grn.supplier?.address || "N/A"}
                        </div>
                        <div className="text-gray-600">
                          {grn.supplier?.phoneNumber || "N/A"}
                        </div>
                        <div className="text-gray-500">
                          {formatDate(grn.date)}
                        </div>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEditClick(grn)}
                            className="py-1 text-sm rounded text-blue-600"
                            title="Edit"
                          >
                            <SquarePen size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(grn._id)}
                            className="py-1 text-sm text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => handleView(grn)}
                            className="text-amber-600 hover:underline"
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
        </div>

        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingGrn ? "Update GRN" : "Add a New GRN"}
                </h2>
                <button
                  className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                  onClick={() => {
                    setIsSliderOpen(false);
                    setGrnId("");
                    setDate("");
                    setGatePassIn("");
                    setSupplier("");
                    setAddress("");
                    setPhone("");
                    setItemsList([]);
                    setItem("");
                    setQty("");
                    setDescription("");
                    setIsEnable(true);
                    setEditingGrn(null);
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      GRN ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingGrn ? grnId : `GRN-${nextGRNId}`}
                      onChange={(e) => setGrnId(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter GRN ID"
                      readOnly={!!editingGrn}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Supplier <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedSalesman}
                      onChange={handleSalesmanChange}
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-newPrimary"
                    >
                      <option value="">Select Salesman</option>
                      {salesmanList.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.employeeName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Balance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={balance}
                      readOnly
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-100"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={phone}
                      readOnly
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-100"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-gray-700 font-medium mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      readOnly
                      disabled
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-100"
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                {/* items section */}
                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                  <div className="flex gap-4">
                    {/* Item Dropdown */}
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">Item</label>
                      <select
                        value={item}
                        onChange={handleItemsChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                      >

                        <option value="">Select Item</option>
                        {itemOptions.map((opt) => (
                          <option key={opt._id} value={opt._id}>
                            {opt.itemName} ({opt.itemUnit?.unitName})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rate */}
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">Rate</label>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter rate"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                      <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter quantity"
                        min="1"
                      />
                    </div>

                    {/* Total (auto calc) */}
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">Total</label>
                      <input
                        type="number"
                        value={qty && rate ? qty * rate : ""}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
                        placeholder="Auto Total"
                      />
                    </div>

                    {/* Add Button */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!item || !qty || !rate) {
                            toast.error("Please fill all fields");
                            return;
                          }

                          const selectedItem = itemOptions.find((opt) => opt._id === item);
                          const total = qty * rate;

                          const newItem = {
                            item: selectedItem?.itemName || "Unknown",
                            qty,
                            rate,
                            total,
                          };

                          setItemsList((prev) => [...prev, newItem]);
                          setItem("");
                          setQty("");
                          setRate("");
                        }}

                        className="w-20 h-12 bg-newPrimary text-white rounded-lg hover:bg-newPrimary/80 transition"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* Items Table */}
                  {itemsList.length > 0 && (
                    <div className="overflow-x-auto">
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full border-collapse">
                          <thead className="bg-gray-100 text-gray-600 text-sm">
                            <tr>
                              <th className="px-4 py-2 border border-gray-300">Sr #</th>
                              <th className="px-4 py-2 border border-gray-300">Item</th>
                              <th className="px-4 py-2 border border-gray-300">Qty</th>
                              <th className="px-4 py-2 border border-gray-300">Rate</th>
                              <th className="px-4 py-2 border border-gray-300">Total</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700 text-sm">
                            {itemsList.map((it, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 text-center">
                                <td className="px-4 py-2 border border-gray-300">{idx + 1}</td>
                                <td className="px-4 py-2 border border-gray-300">{it.item}</td>
                                <td className="px-4 py-2 border border-gray-300">{it.qty}</td>
                                <td className="px-4 py-2 border border-gray-300">{it.rate}</td>
                                <td className="px-4 py-2 border border-gray-300">{it.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Summary Section */}
                  {itemsList.length > 0 && (
                    <div className="mt-4 border-t pt-4 flex justify-between items-start text-sm text-gray-700">
                      {/* LEFT SIDE: Total Items + Total Qty */}
                      <div>
                        <p className="font-semibold">
                          Total Items:{" "}
                          <span className="font-normal">{itemsList.length}</span>
                        </p>
                        <p className="font-semibold">
                          Total Qty:{" "}
                          <span className="font-normal">
                            {itemsList.reduce((sum, i) => sum + i.qty, 0)}
                          </span>
                        </p>
                      </div>

                      {/* RIGHT SIDE: Total Amount + Discount + Payable */}
                      <div className="text-right">
                        <p className="font-semibold">
                          Total Amount:{" "}
                          <span className="font-normal">
                            {itemsList
                              .reduce((sum, i) => sum + i.total, 0)
                              .toLocaleString()}
                          </span>
                        </p>

                        <div className="flex items-center justify-end gap-2 mt-1">
                          <label className="font-semibold">Discount:</label>
                          <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                            className="w-28 p-2 border rounded-md text-right"
                            placeholder="0"
                          />
                        </div>

                        <p className="font-semibold mt-1">
                          Payable:{" "}
                          <span className="font-bold text-green-600">
                            {(
                              itemsList.reduce((sum, i) => sum + i.total, 0) -
                              (discount || 0)
                            ).toLocaleString()}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                </div>


                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors disabled:bg-blue-300"
                >
                  {loading
                    ? "Saving..."
                    : editingGrn
                      ? "Update GRN"
                      : "Save GRN"}
                </button>
              </form>
            </div>
          </div>
        )}

        {isView && selectedGrn && (
          <ViewModel
            data={selectedGrn}
            type="grn"
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

export default GRN;
