import React, { useState, useEffect, useCallback, useRef } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CommanHeader from "../../../../../src/components/CommanHeader";
import { SquarePen, Trash2 } from "lucide-react";
import TableSkeleton from "../../Skeleton";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vehicleName, setVehicleName] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("Car");
  const [registrationNo, setRegistrationNo] = useState("");
  const [isEnable, setIsEnable] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const sliderRef = useRef(null);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/vehicles`;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Fetch Vehicle List
  const fetchVehiclesList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setVehicles(res.data);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  }, []);

  useEffect(() => {
    fetchVehiclesList();
  }, [fetchVehiclesList]);

  // GSAP Animation
  useEffect(() => {
    if (isSliderOpen) {
      if (sliderRef.current) sliderRef.current.style.display = "block";
      gsap.fromTo(
        sliderRef.current,
        { scale: 0.7, opacity: 0, y: -50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    } else {
      gsap.to(sliderRef.current, {
        scale: 0.7,
        opacity: 0,
        y: -50,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          if (sliderRef.current) sliderRef.current.style.display = "none";
        },
      });
    }
  }, [isSliderOpen]);

  // Handlers
  const handleAddClick = () => {
    setEditingVehicle(null);
    setVehicleName("");
    setModel("");
    setCategory("Car");
    setRegistrationNo("");
    setIsEnable(true);
    setIsSliderOpen(true);
  };

  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleName(vehicle.vehicleName);
    setModel(vehicle.model);
    setCategory(vehicle.category);
    setRegistrationNo(vehicle.registrationNo);
    setIsEnable(vehicle.isEnable);
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleName.trim() || !model.trim() || !registrationNo.trim()) {
      toast.error("❌ All fields are required.");
      return;
    }

    setLoading(true);

    const payload = {
      vehicleName,
      model,
      category,
      registrationNo,
      isEnable,
    };

    try {
      let res;
      if (editingVehicle) {
        res = await axios.put(`${API_URL}/${editingVehicle._id}`, payload, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setVehicles(
          vehicles.map((v) => (v._id === editingVehicle._id ? res.data : v))
        );
        toast.success("✅ Vehicle updated!");
      } else {
        res = await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setVehicles([...vehicles, res.data]);
        toast.success("✅ Vehicle added!");
      }

      setIsSliderOpen(false);
      fetchVehiclesList();
      setEditingVehicle(null);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to save vehicle.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    const swal = Swal.mixin({
      customClass: {
        actions: "space-x-2",
        confirmButton:
          "bg-green-500 text-white px-4 py-4 rounded hover:bg-green-600",
        cancelButton:
          "bg-red-500 text-white px-4 py-4 rounded hover:bg-red-600",
      },
      buttonsStyling: false,
    });

    swal
      .fire({
        title: "Are you sure?",
        text: "This vehicle will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.delete(`${API_URL}/${vehicleId}`, {
              headers: { Authorization: `Bearer ${userInfo?.token}` },
            });
            setVehicles(vehicles.filter((v) => v._id !== vehicleId));
            toast.success("✅ Vehicle deleted!");
          } catch (error) {
            toast.error("❌ Failed to delete vehicle.");
          }
        }
      });
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="px-6 mx-auto">
        <CommanHeader />
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">All Vehicles</h1>
            <p className="text-gray-500 text-sm">Manage your vehicle records</p>
          </div>
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
            onClick={handleAddClick}
          >
            + Add Vehicle
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="hidden lg:grid grid-cols-[80px_1fr_1fr_1fr_1fr_150px] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>SR</div>
                <div>Name</div>
                <div>Model</div>
                <div>Category</div>
                <div>Registration No</div>
                <div className="text-center">Actions</div>
              </div>

              <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {loading ? (
                  <TableSkeleton rows={5} cols={6} />
                ) : vehicles.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No vehicles found.
                  </div>
                ) : (
                  vehicles.map((vehicle, index) => (
                    <div
                      key={vehicle._id}
                      className="grid grid-cols-1 lg:grid-cols-[80px_1fr_1fr_1fr_1fr_150px] gap-4 lg:gap-6 items-center px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="font-medium text-gray-700">
                        {index + 1}
                      </div>
                      <div className="text-gray-700">{vehicle.vehicleName}</div>
                      <div className="text-gray-700">{vehicle.model}</div>
                      <div className="text-gray-700">{vehicle.category}</div>
                      <div className="text-gray-700">
                        {vehicle.registrationNo}
                      </div>
                      <div className="text-center">
                        <button
                          onClick={() => handleEditClick(vehicle)}
                          className="px-3 py-1 text-sm text-blue-600"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle._id)}
                          className="px-3 py-1 text-sm text-red-600"
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

        {/* Add/Edit Vehicle Modal */}
        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="w-full md:w-[500px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">
                  {editingVehicle ? "Update Vehicle" : "Add a New Vehicle"}
                </h2>
                <button
                  className="w-8 h-8 bg-newPrimary text-white rounded-full flex items-center justify-center hover:bg-newPrimary/70"
                  onClick={() => setIsSliderOpen(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Vehicle Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vehicleName}
                    onChange={(e) => setVehicleName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                    placeholder="e.g. Honda Civic"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                    placeholder="e.g. 2022"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                  >
                    <option>Car</option>
                    <option>Truck</option>
                    <option>Bus</option>
                    <option>Motorcycle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Registration Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                    placeholder="e.g. ABC-1234"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-gray-700 font-medium">Status</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEnable(!isEnable)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                        isEnable ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          isEnable ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span
                      className={`text-sm font-medium ${
                        isEnable ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {isEnable ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80 disabled:bg-newPrimary/50"
                >
                  {loading ? "Saving..." : "Save Vehicle"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicle;
