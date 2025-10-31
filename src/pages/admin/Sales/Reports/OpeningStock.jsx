import { SaveIcon, Search } from "lucide-react";
import React, { useState, useCallback, useEffect, useRef } from "react";

import CommanHeader from "../../Components/CommanHeader";
import axios from "axios";
import TableSkeleton from "../../Components/Skeleton";
import toast from "react-hot-toast";

const OpeningStock = () => {
  const [itemCategory, setItemCategory] = useState("");
  const [itemType, setItemType] = useState("");
  const [showRate, setShowRate] = useState(true);

  const [categoryList, setCategoryList] = useState([]);
  const [itemNameList, setItemNameList] = useState([]);
  const [itemTypeList, setItemTypeList] = useState([]);
  const [editingStockIndex, setEditingStockIndex] = useState(null);
const tableRef = useRef(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    category: "",
    itemType: "",
    itemSearch: "",
  });

  // Refresh the Page called api
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/item-details`
        );
        setItemNameList(res.data);
      } catch (error) {
        console.error("Failed to fetch all items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  // CategoryList Fetch
  const fetchCategoryList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/categories`
      );
      setCategoryList(res.data); // store actual categories array
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);
  useEffect(() => {
    fetchCategoryList();
  }, [fetchCategoryList]);

  // Fetch itemTypes when category changes
  useEffect(() => {
    if (!itemCategory) return; // only call when category selected

    const fetchItemTypes = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/item-type/category/${itemCategory}`
        );
        setItemTypeList(res.data);
      } catch (error) {
        console.error("Failed to fetch item types", error);
      }
    };

    fetchItemTypes();
  }, [itemCategory]);

  // when itemType Select then Table repaint according api response
  useEffect(() => {
    if (!itemType) return;

    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/item-details/item-type/${itemType}`
        );

        setItemNameList(res.data);
      } catch (error) {
        console.error("Failed to fetch items", error);
      }
    };

    fetchItems();
  }, [itemType]);

  // Track editing state per cell
  const [editing, setEditing] = useState({});

  const handleChange = (index, field, value) => {
    const updated = [...itemNameList];
    updated[index][field] = value;
    setItemNameList(updated);
  };

  const handleBlur = (index, field) => {
    setEditing((prev) => ({ ...prev, [`${index}-${field}`]: false }));
  };

  const handleFocus = (index, field) => {
    setEditing((prev) => ({ ...prev, [`${index}-${field}`]: true }));
  };

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  // ✅ Hide Action when clicking outside the table
useEffect(() => {
  const handleClickOutside = (event) => {
    if (tableRef.current && !tableRef.current.contains(event.target)) {
      setEditingStockIndex(null);
    }
  };

  // ✅ use capture phase so it triggers before React bubbling
  document.addEventListener("click", handleClickOutside, true);

  return () => {
    document.removeEventListener("click", handleClickOutside, true);
  };
}, []);



  return (
    <div className="p-6 space-y-6">
      {/* Heading */}
      {/* Common Header */}
      <CommanHeader />
      <h1 className="text-2xl font-bold text-newPrimary">Opening Balance</h1>

      {/* Form */}
      <div className="border rounded-lg shadow bg-white p-6 w-full">
        <div className="grid grid-cols-3 gap-6 items-end w-full">
          {/* Category */}
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Select Category</option>
              {categoryList.map((cat, idx) => (
                <option key={cat._id} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Item Type */}
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-1">
              Item Type
            </label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              disabled={!itemCategory} // ✅ disable when itemCategory is null/undefined/empty
              className={`w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200 
      ${!itemCategory ? "bg-gray-100 cursor-not-allowed" : ""}`} // ✅ add style when disabled
            >
              <option value="">Select Item Type</option>
              {itemTypeList.map((type) => (
                <option key={type._id} value={type.itemTypeName}>
                  {type.itemTypeName}
                </option>
              ))}
            </select>
          </div>

          {/* With/Without Rate Toggle */}
          <div className="flex items-center gap-4 mt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showRate}
                onChange={() => setShowRate(!showRate)}
                className="w-4 h-4 accent-newPrimary cursor-pointer"
              />
              <span className="text-gray-700 font-medium">
                {showRate ? "With Rate" : "Without Rate"}
              </span>
            </label>
          </div>

          {/* Search bar with icon (no label) */}

          {itemNameList.length > 10 && (
            <div className="w-full">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </span>
                <input
                  type="text"
                  value={form.itemSearch}
                  onChange={(e) =>
                    setForm({ ...form, itemSearch: e.target.value })
                  }
                  placeholder="Search Item..."
                  aria-label="Search Item"
                  className="w-full h-10 pl-10 pr-3 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}

      {/* TABLE / CARDS */}

      <div  ref={tableRef} className="rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="overflow-y-auto lg:overflow-x-auto max-h-[800px]">
          <div className="min-w-[1000px]">
            {/* ✅ Table Header */}
            <div
              className={`hidden lg:grid ${
                editingStockIndex !== null
                  ? "grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr_auto]"
                  : "grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr]"
              } gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200`}
            >
              <div>Sr</div>
              <div>Category</div>
              <div>Type</div>
              <div>Item</div>
              {showRate && (
                <>
                  <div>Purchase</div>
                  <div>Sales</div>
                </>
              )}

              <div>Stock</div>
              {editingStockIndex !== null && <div>Action</div>}
            </div>

            {/* ✅ Table Body */}
            <div className="flex flex-col divide-y divide-gray-100 max-h-screen overflow-y-auto">
              {loading ? (
                <TableSkeleton
                  rows={itemNameList.length > 0 ? itemNameList.length : 5}
                  cols={editingStockIndex !== null ? 8 : 7}
                  className={`${
                    editingStockIndex !== null
                      ? "lg:grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr_auto]"
                      : "lg:grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr]"
                  }`}
                />
              ) : itemNameList.length === 0 ? (
                <div className="text-center py-4 text-gray-500 bg-white">
                  No items found.
                </div>
              ) : (
                itemNameList.map((rec, index) => (
                  <div
                    key={rec.code}
                    className={`grid ${
                      editingStockIndex !== null
                        ? "grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr_auto]"
                        : "grid-cols-[0.5fr_1fr_1fr_2fr_1fr_1fr_1fr]"
                    } items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition`}
                  >
                    <div>{index + 1}</div>
                    <div>{rec?.itemCategory?.categoryName}</div>
                    <div>{rec?.itemType?.itemTypeName}</div>
                    <div className="font-medium text-gray-900">
                      {rec.itemName}
                    </div>

                    {showRate && (
                      <>
                        {/* Editable Purchase */}
                        <div className="text-gray-600">
                          {editing[`${index}-purchase`] ? (
                            <input
                              type="number"
                              value={rec.purchase}
                              onChange={(e) =>
                                handleChange(index, "purchase", e.target.value)
                              }
                              onBlur={() => handleBlur(index, "purchase")}
                              autoFocus
                              className="w-20 border rounded p-1"
                            />
                          ) : (
                            <span
                              onClick={() => handleFocus(index, "purchase")}
                              className="cursor-pointer"
                            >
                              {rec.purchase}
                            </span>
                          )}
                        </div>

                        {/* Editable Sales */}
                        <div className="text-gray-600">
                          {editing[`${index}-sales`] ? (
                            <input
                              type="number"
                              value={rec.price}
                              onChange={(e) =>
                                handleChange(index, "sales", e.target.value)
                              }
                              onBlur={() => handleBlur(index, "sales")}
                              autoFocus
                              className="w-20 border rounded p-1"
                            />
                          ) : (
                            <span
                              onClick={() => handleFocus(index, "sales")}
                              className="cursor-pointer"
                            >
                              {rec.price}
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    {/* Editable Stock */}
                    <div className="text-gray-600">
                      {editing[`${index}-stock`] ? (
                        <input
                          type="number"
                          value={rec.stock}
                          onChange={(e) =>
                            handleChange(index, "stock", e.target.value)
                          }
                          onBlur={() => {
                            handleBlur(index, "stock");
                            setEditingStockIndex(index);
                          }}
                          autoFocus
                          className="w-20 border rounded p-1"
                        />
                      ) : (
                        <span
                          onClick={() => {
                            handleFocus(index, "stock");
                            setEditingStockIndex(index);
                          }}
                          className="cursor-pointer"
                        >
                          {rec.stock}
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    {editingStockIndex === index && (
                      <div className="flex gap-3 justify-end">
                        <button
                          className="text-newPrimary hover:bg-green-50 rounded p-1"
                          onClick={async () => {
                            try {
                              await axios.put(
                                `${
                                  import.meta.env.VITE_API_BASE_URL
                                }/item-details/${rec._id}/stock`,
                                { stock: rec.stock },
                                {
                                  headers: {
                                    Authorization: `Bearer ${userInfo?.token}`,
                                  },
                                }
                              );
                              console.log(
                                "✅ Stock updated successfully:",
                                rec.itemName,
                                rec.stock
                              );
                              setEditingStockIndex(null);
                              toast.success("Stock updated successfully");
                            } catch (error) {
                              toast.success(
                                error.response?.data?.message ||
                                  "Failed to update stock"
                              );
                              console.error("Failed to update stock:", error);
                            }
                          }}
                        >
                          <SaveIcon size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpeningStock;
