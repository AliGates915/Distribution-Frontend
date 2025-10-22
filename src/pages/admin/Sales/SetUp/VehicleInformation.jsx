import React, { useState, useEffect, useCallback, useRef } from "react";
import { HashLoader } from "react-spinners";
import gsap from "gsap";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CommanHeader from "../../Components/CommanHeader";
import { SquarePen, Trash2 } from "lucide-react";
import TableSkeleton from "../../Components/Skeleton";

const VehicleInformation = () => {
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
  const [vehicleNo, setVehicleNo] = useState("");
  const [make, setMake] = useState("");
  const [vehicleType, setVehicleType] = useState("company"); // default radio button
  const [startingDate, setStartingDate] = useState("");

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

  // Update handleAddClick
  const handleAddClick = () => {
    setEditingVehicle(null);
    setVehicleNo("");
    setVehicleName("");
    setMake("");
    setModel("");
    setCategory("Car");
    setRegistrationNo("");
    setStartingDate("");
    setVehicleType("company");
    setIsEnable(true);
    setIsSliderOpen(true);
  };

  // Update handleEditClick
  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleNo(vehicle.vehicleNo || "");
    setVehicleName(vehicle.vehicleName || "");
    setMake(vehicle.make || "");
    setModel(vehicle.model || "");
    setCategory(vehicle.category || "Car");
    setRegistrationNo(vehicle.registrationNo || "");
    setStartingDate(vehicle.startingDate || "");
    setVehicleType(vehicle.vehicleType || "company");
    setIsEnable(vehicle.isEnable);
    setIsSliderOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({
      vehicleNo,
      vehicleName,
      make,
      model,
      registrationNo,
      startingDate,
      vehicleType,
    });

    if (
      !vehicleNo ||
      !vehicleName ||
      !make ||
      !model ||
      !registrationNo ||
      !startingDate ||
      !vehicleType
    ) {
      toast.error("❌ All fields are required.");
      return;
    }

    setLoading(true);

    // Update handleSubmit payload
    const payload = {
      vehicleNo,
      vehicleName,
      make,
      model,
      category,
      registrationNo,
      startingDate,
      vehicleType,
      isEnable,
    };
    try {
      let res;
      if (editingVehicle) {
        await axios.put(`${API_URL}/${editingVehicle._id}`, payload, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        toast.success("✅ Vehicle updated!");
      } else {
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        toast.success("✅ Vehicle added!");
      }
      setIsSliderOpen(false);
      await fetchVehiclesList(); // Wait to ensure backend updated
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
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_120px] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                <div>SR</div>
                <div>Vehicle No</div>
                <div>Make</div>
                <div>Model</div>
                <div>Registration No</div>
                <div>Starting Date</div>
                <div className="text-center">Actions</div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {loading ? (
                  <TableSkeleton rows={5} cols={7} />
                ) : vehicles.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-white">
                    No vehicles found.
                  </div>
                ) : (
                  vehicles.map((vehicle, index) => (
                    <div
                      key={vehicle._id}
                      className="grid grid-cols-1 lg:grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_120px] gap-4 lg:gap-6 items-center px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                    >
                      <div className="font-medium text-gray-700">
                        {index + 1}
                      </div>
                      <div className="text-gray-700">{vehicle.vehicleNo}</div>
                      <div className="text-gray-700">{vehicle.make}</div>
                      <div className="text-gray-700">{vehicle.model}</div>
                      <div className="text-gray-700">
                        {vehicle.registrationNo}
                      </div>
                      <div className="text-gray-700">
                        {vehicle.startingDate
                          ? new Date(vehicle.startingDate).toLocaleDateString()
                          : "—"}
                      </div>

                      <div className="text-center flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(vehicle)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle._id)}
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
                    Vehicle No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                    placeholder="e.g. ABC-1234"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Make <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                    placeholder="e.g. Honda"
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

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Starting Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startingDate || ""}
                    onChange={(e) => setStartingDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-newPrimary"
                  />
                </div>

                <div>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="vehicleType"
                        value="company"
                        checked={vehicleType === "company"}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="form-radio"
                      />
                      Company Own
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="vehicleType"
                        value="rental"
                        checked={vehicleType === "rental"}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="form-radio"
                      />
                      Rental
                    </label>
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

export default VehicleInformation;
