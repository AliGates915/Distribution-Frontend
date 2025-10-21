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
      { itemName: "Widget A", quantity: 10, description: "High-quality widget" },
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
    items: [
      { _id: "item3", itemName: "Gadget X", quantity: 20 },
    ],
  },
];

const staticItemOptions = [
  { _id: "item1", itemName: "Widget A", quantity: 10 },
  { _id: "item2", itemName: "Widget B", quantity: 5 },
  { _id: "item3", itemName: "Gadget X", quantity: 20 },
];

const GRN = () => {
  const [grns, setGrns] = useState([]);
  const [gatePassOptions, setGatePassOptions] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [grnId, setGrnId] = useState("");
  const [date, setDate] = useState("");
  const [gatePassIn, setGatePassIn] = useState("");
  const [supplier, setSupplier] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [description, setDescription] = useState("");
  const [isEnable, setIsEnable] = useState(true);
  const [isView, setIsView] = useState(false);
  const [editingGrn, setEditingGrn] = useState(null);
  const [selectedGrn, setSelectedGrn] = useState(null);
  const sliderRef = useRef(null);
  const [nextGRNId, setNextGrnId] = useState("001");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Handle adding items to the table in the form
  const handleAddItem = async () => {
    if (!item || !description) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "⚠️ Please select an item and enter description.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    try {
      const { token } = userInfo || {};
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/qualityCheck/${gatePassIn}`,
        {
          itemId: item,
          description: description,
        },
        { headers }
      );

      const selectedOption = itemOptions.find((opt) => opt._id === item);
      const newItem = {
        item: selectedOption?.itemName || "",
        qty: selectedOption?.quantity || 0,
        description,
      };

      setItemsList([...itemsList, newItem]);
      setItem("");
      setQty("");
      setDescription("");
    } catch (error) {
      console.error("Error adding item:", error);
      Swal.fire("Error!", "Failed to add item.", "error");
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
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/items`, {
        headers,
      });
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
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/grn`,
          newGrn,
          { headers }
        );
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
                    <TableSkeleton rows={5} cols={7} className="lg:grid-cols-7" />
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
                        <div className="text-gray-500">{formatDate(grn.date)}</div>
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
                      type="text"
                      value={supplier}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      placeholder="Enter supplier name"
                    >
                      <option value="">Select Supplier</option>
                      {/* {suppliers.map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>
                          {supplier.name}
                        </option>
                      ))} */}
                      </select>
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

                <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">
                        Item
                      </label>
                      <select
                        value={item}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setItem(selectedId);
                          const selectedOption = itemOptions.find(
                            (opt) => opt._id === selectedId
                          );
                          if (selectedOption) {
                            setQty(selectedOption.quantity || "");
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                      >
                        <option value="">Select Item</option>
                        {itemOptions.map((opt) => (
                          <option key={opt._id} value={opt._id}>
                            {opt.itemName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={qty}
                        readOnly
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary bg-gray-100"
                        placeholder="Enter quantity"
                        min="1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-gray-700 font-medium mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                        placeholder="Enter description"
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
                              <th className="px-4 py-2 border border-gray-300">
                                Sr #
                              </th>
                              <th className="px-4 py-2 border border-gray-300">
                                Item
                              </th>
                              <th className="px-4 py-2 border border-gray-300">
                                Qty
                              </th>
                              <th className="px-4 py-2 border border-gray-300">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700 text-sm">
                            {itemsList.map((item, idx) => (
                              <tr
                                key={idx}
                                className="hover:bg-gray-50 text-center"
                              >
                                <td className="px-4 py-2 border border-gray-300 text-center">
                                  {idx + 1}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                  {item.item}
                                </td>
                                <td className="px-4 py-2 border border-gray-300 text-center">
                                  {item.qty}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">
                                  {item.description}
                                </td>
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