import React, { useRef } from "react";
import { X } from "lucide-react";

const ViewModal = ({ type, data, onClose }) => {
  const printRef = useRef();

  // ✅ Print Function
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`
      <html>
        <head>
          <title>${type} Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background: #f3f3f3; }
            .info { display: flex; justify-content: space-between; flex-wrap: wrap; margin-bottom: 8px; }
            .info div { width: 48%; margin-bottom: 4px; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };
  // ✅ PDF Placeholder
  const handlePDF = () => {
    alert("PDF export coming soon 🚀 (use html2pdf.js or jsPDF here)");
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[750px] rounded-xl shadow-lg p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* PRINTABLE AREA */}
        <div ref={printRef}>
          <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">
            {type === "loadsheet"
              ? "Loadsheet Details"
              : type === "order"
              ? "Order Details"
              : "Details"}
          </h2>

          {/* INFO SECTION */}
          <div className="grid grid-cols-2 gap-4 text-base mb-6">
            {type === "loadsheet" && (
              <>
                <div><strong>Load No:</strong> {data.loadNo}</div>
                <div><strong>Load Date:</strong> {new Date(data.loadDate).toLocaleDateString()}</div>
                <div><strong>Salesman:</strong> {data.salesmanId?.employeeName}</div>
                <div><strong>Vehicle No:</strong> {data.vehicleNo}</div>
                <div><strong>Total Qty:</strong> {data.totalQty}</div>
                <div><strong>Total Amount:</strong> {data.totalAmount}</div>
              </>
            )}

            {type === "order" && (
              <>
                <div><strong>Order ID:</strong> {data.orderId}</div>
                <div><strong>Date:</strong> {new Date(data.date).toLocaleDateString()}</div>
                <div><strong>Salesman:</strong> {data.salesmanId?.employeeName}</div>
                <div><strong>Customer:</strong> {data.customerId?.customerName}</div>
                <div><strong>Phone:</strong> {data.customerId?.phoneNumber}</div>
                <div><strong>Balance:</strong> {data.customerId?.balance}</div>
              </>
            )}
          </div>

          {/* TABLE SECTION */}
          <table className="w-full border text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th>Sr #</th>
                <th>Category</th>
                <th>Item</th>
                <th>Pack</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(data.products || []).map((item, idx) => (
                <tr key={idx}>
                  <td className="text-center py-1">{idx + 1}</td>
                  <td className="text-center py-1">{item.category || item.categoryName}</td>
                  <td className="text-center py-1">{item.item || item.itemName}</td>
                  <td className="text-center py-1">{item.pack || item.itemUnit}</td>
                  <td className="text-center py-1">{item.issues || item.qty}</td>
                  <td className="text-center py-1">{item.amount || item.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ACTIONS */}
        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handlePDF}
            className="px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
