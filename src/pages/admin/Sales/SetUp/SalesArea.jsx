import React, { useState, useRef } from "react";
import CommanHeader from "../../Components/CommanHeader";
import { SquarePen, Trash2, Eye } from "lucide-react";

const AreaPage = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const sliderRef = useRef(null);

  const [areaData, setAreaData] = useState({
    areaName: "",
    areaDescription: "",
  });

  // ✅ Add dummy data here
  const [areas, setAreas] = useState([
    {
      areaName: "Central Park",
      areaDescription:
        "A large public park in the city center, ideal for events.",
    },
    {
      areaName: "Downtown Market",
      areaDescription: "A busy shopping area with multiple stores and vendors.",
    },
    {
      areaName: "Riverside Plaza",
      areaDescription:
        "A scenic area near the river, good for leisure activities.",
    },
    {
      areaName: "Tech Hub",
      areaDescription: "A business district with modern offices and startups.",
    },
    {
      areaName: "Green Meadows",
      areaDescription: "A peaceful area with gardens and walking paths.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const totalPages = Math.ceil(areas.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = areas.slice(indexOfFirstRecord, indexOfLastRecord);

  const resetForm = () => {
    setIsSliderOpen(false);
    setAreaData({ areaName: "", areaDescription: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAreas((prev) => [...prev, areaData]);
    resetForm();
  };

  const handleDelete = (index) => {
    setAreas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditClick = (index) => {
    setAreaData(areas[index]);
    setIsSliderOpen(true);
    handleDelete(index);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <CommanHeader />
      <div className="px-6 mx-auto max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-newPrimary">Area Details</h1>
          <button
            onClick={() => setIsSliderOpen(true)}
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80"
          >
            + Add Area
          </button>
        </div>

        <div className="rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="inline-block min-w-[900px] w-full align-middle overflow-x-auto">
                {/* Header */}
                <div className="hidden lg:grid grid-cols-[20px_1fr_3fr_1fr] gap-6 bg-gray-100 py-3 px-6 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10 border-b border-gray-200">
                  <div>SR#</div>
                  <div>Area Name</div>
                  <div>Area Description</div>
                  <div className="text-right">Actions</div>
                </div>

                {/* Body */}
                <div className="flex flex-col divide-y divide-gray-100">
                  {areas.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 bg-white">
                      No areas added yet.
                    </div>
                  ) : (
                    currentRecords.map((area, idx) => (
                      <div
                        key={indexOfFirstRecord + idx}
                        className="grid grid-cols-1 lg:grid-cols-[20px_1fr_3fr_1fr] items-center gap-6 px-6 py-4 text-sm bg-white hover:bg-gray-50 transition"
                      >
                        <div className="text-gray-600">
                          {indexOfFirstRecord + idx + 1}
                        </div>
                        <div className="text-gray-600">{area.areaName}</div>
                        <div className="text-gray-600">
                          {area.areaDescription}
                        </div>
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() =>
                              handleEditClick(indexOfFirstRecord + idx)
                            }
                            className="py-1 text-sm text-blue-600"
                            title="Edit"
                          >
                            <SquarePen size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(indexOfFirstRecord + idx)
                            }
                            className="py-1 text-sm text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center py-4 px-6 bg-white border-t">
                    <p className="text-sm text-gray-600">
                      Showing {indexOfFirstRecord + 1} to{" "}
                      {Math.min(indexOfLastRecord, areas.length)} of{" "}
                      {areas.length} records
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-newPrimary text-white hover:bg-newPrimary/80"
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-newPrimary text-white hover:bg-newPrimary/80"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Slider Form */}
        {isSliderOpen && (
          <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
            <div
              ref={sliderRef}
              className="w-full md:w-[600px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-newPrimary">Add Area</h2>
                <button
                  className="text-2xl text-gray-500 hover:text-gray-700"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-4 md:p-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Area Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={areaData.areaName}
                    onChange={(e) =>
                      setAreaData({ ...areaData, areaName: e.target.value })
                    }
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    placeholder="Enter area name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Area Description
                  </label>
                  <textarea
                    value={areaData.areaDescription}
                    onChange={(e) =>
                      setAreaData({
                        ...areaData,
                        areaDescription: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-newPrimary"
                    placeholder="Enter area description"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-newPrimary text-white px-4 py-3 rounded-lg hover:bg-newPrimary/80"
                >
                  Save Area
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaPage;
