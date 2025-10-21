import React, { useState, useEffect } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import CommanHeader from "../../Components/CommanHeader";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axios from "axios";

const OrderTaking = () => {
  const [orders, setOrders] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [orderId, setOrderId] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [salesman, setSalesman] = useState("");
  const [salesmanList, setSalesmanList] = useState([]);
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [product, setProduct] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("");
  const [rate, setRate] = useState("");
  const [total, setTotal] = useState("");
  const [items, setItems] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const unitList = ["Box", "Bottle", "Pack"];

  // Fetch Employe List
  async function fetchEmployees() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/employees`
      );
      setSalesmanList(res.data);
    } catch (error) {
      console.error("Failed to fetch Employees", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);
  // Fetch customers
  async function fetchCustomers() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/customers`
      );
      setCustomersList(res.data);
    } catch (error) {
      console.error("Failed to fetch Employees", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  // fetch fished Goods

  async function fetchFinshedGoods() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/item-details/order-taker`
      );
      setProductsList(res.data);
    } catch (error) {
      console.error("Failed to fetch Employees", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }

  useEffect(() => {
    fetchFinshedGoods();
  }, []);

  // Auto-generate Order ID and Date
  useEffect(() => {
    if (!editingOrder) {
      const nextId = (orders.length + 1).toString().padStart(3, "0");
      setOrderId(`ORD-${nextId}`);
      setOrderDate(new Date().toISOString().split("T")[0]);
    }
  }, [isSliderOpen, orders, editingOrder]);

  // Auto calculate total
  useEffect(() => {
    const t = (parseFloat(qty) || 0) * (parseFloat(rate) || 0);
    setTotal(t);
  }, [qty, rate]);

  const handleAddItem = () => {
    if (!product || !qty || !unit || !rate) {
      toast.error("Please fill all product fields");
      return;
    }

    const newItem = {
      id: items.length + 1,
      product,
      qty,
      unit,
      rate,
      total,
    };

    setItems([...items, newItem]);
    setProduct("");
    setQty("");
    setUnit("");
    setRate("");
    setTotal("");
  };

  const handleSaveOrder = (e) => {
    e.preventDefault();
    if (!salesman || !customer || items.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const newOrder = {
      id: orderId,
      date: orderDate,
      salesman,
      customer,
      address,
      phone,
      items,
    };

    if (editingOrder) {
      // update existing order
      setOrders((prev) =>
        prev.map((o) => (o.id === editingOrder.id ? newOrder : o))
      );
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Order updated successfully.",
        confirmButtonColor: "#3085d6",
      });
    } else {
      // new order
      setOrders([...orders, newOrder]);
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Order saved successfully.",
        confirmButtonColor: "#3085d6",
      });
    }

    resetForm();
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setOrderId(order.id);
    setOrderDate(order.date);
    setSalesman(order.salesman);
    setCustomer(order.customer);
    setAddress(order.address);
    setPhone(order.phone);
    setItems(order.items);
    setIsSliderOpen(true);
  };

  const resetForm = () => {
    setEditingOrder(null);
    setOrderId("");
    setOrderDate("");
    setSalesman("");
    setCustomer("");
    setAddress("");
    setPhone("");
    setProduct("");
    setQty("");
    setUnit("");
    setRate("");
    setTotal("");
    setItems([]);
    setIsSliderOpen(false);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the order.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        Swal.fire("Deleted!", "Order deleted successfully.", "success");
      }
    });
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = orders.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(orders.length / recordsPerPage);
  console.log({ productsList });

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />

      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-newPrimary">Order Taking</h1>
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
            onClick={() => setIsSliderOpen(true)}
          >
            + Add Order
          </button>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-y-auto lg:overflow-x-auto max-h-[800px]">
            <div className="min-w-[1000px]">
              <div className="hidden lg:grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>SR</div>
                <div>Order ID</div>
                <div>Date</div>
                <div>Salesman</div>
                <div>Customer</div>
                <div>Phone</div>
                <div>Actions</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100">
                {currentRecords.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No Orders Found
                  </div>
                ) : (
                  currentRecords.map((order, i) => (
                    <div
                      key={order.id}
                      className="grid grid-cols-1 lg:grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 text-sm bg-white hover:bg-gray-50"
                    >
                      <div>{indexOfFirstRecord + i + 1}</div>
                      <div>{order.id}</div>
                      <div>{order.date}</div>
                      <div>{order.salesman}</div>
                      <div>{order.customer}</div>
                      <div>{order.phone}</div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(order)}
                          className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded"
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

        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div className="w-full md:w-[800px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingOrder ? "Edit Order" : "Add New Order"}
                </h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveOrder} className="space-y-4 p-6">
                {/* ID and Date */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-700 mb-2">Order ID</label>
                    <input
                      type="text"
                      value={orderId}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={orderDate}
                      readOnly
                      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>

                {/* Salesman */}
                <div className="w-[400px]">
                  <label className="block text-gray-700 mb-2">Salesman</label>
                  <select
                    value={salesman}
                    onChange={(e) => setSalesman(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Salesman</option>
                    {salesmanList.map((sale) => (
                      <option key={sale._id}>{sale?.employeeName}</option>
                    ))}
                  </select>
                </div>

                {/* Customer Info */}
                <div className="border p-4 rounded-lg bg-gray-100 space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-gray-700 mb-2">
                        Customer
                      </label>
                      <select
                        value={customer}
                        onChange={(e) => {
                          const selected = customersList.find(
                            (c) => c._id === e.target.value
                          );
                          setCustomer(e.target.value);
                          setAddress(selected?.address || "");
                          setPhone(selected?.phoneNumber || "");
                        }}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Customer</option>
                        {customersList.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.customerName}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* phone */}
                    <div className="flex-1">
                      <label className="block text-gray-700 mb-2">Phone</label>
                      <input
                        type="text"
                        value={phone}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={address}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Entry */}
                <div className="border p-4 rounded-lg bg-gray-100 space-y-3">
                  <div className="grid grid-cols-6 gap-3 items-end">
                    <div>
                      <label className="text-gray-700 text-sm">Product</label>
                      <select
                        value={product}
                        onChange={(e) => {
                          const selected = productsList.find(
                            (p) => p.itemName === e.target.value
                          );
                          setProduct(e.target.value);
                          setRate(selected?.price || "");
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select</option>
                        {productsList.map((p) => (
                          <option key={p._id}>{p.itemName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-700 text-sm">Qty</label>
                      <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700 text-sm">Unit</label>
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select</option>
                        <option value="Kg">Kg</option>
                        <option value="Pet">Pet</option>
                        <option value="Mann">Mann</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-700 text-sm">Rate</label>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700 text-sm">Total</label>
                      <input
                        type="number"
                        value={total}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="w-full bg-newPrimary text-white py-2 rounded-md hover:bg-newPrimary/90"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mt-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] bg-gray-200 text-sm font-semibold text-gray-600">
                      <div className="px-4 py-2">SR</div>
                      <div className="px-4 py-2">Product</div>
                      <div className="px-4 py-2">Qty</div>
                      <div className="px-4 py-2">Unit</div>
                      <div className="px-4 py-2">Rate</div>
                      <div className="px-4 py-2">Total</div>
                    </div>
                    {items.length === 0 ? (
                      <div className="text-center py-3 text-gray-500 bg-white">
                        No items added yet.
                      </div>
                    ) : (
                      items.map((it, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] text-sm bg-white border-t"
                        >
                          <div className="px-4 py-2">{i + 1}</div>
                          <div className="px-4 py-2">{it.product}</div>
                          <div className="px-4 py-2">{it.qty}</div>
                          <div className="px-4 py-2">{it.unit}</div>
                          <div className="px-4 py-2">{it.rate}</div>
                          <div className="px-4 py-2">{it.total}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-newPrimary text-white py-3 rounded-lg hover:bg-newPrimary/80"
                >
                  {editingOrder ? "Update Order" : "Save Order"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTaking;
