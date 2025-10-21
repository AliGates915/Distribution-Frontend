import React, { useRef } from "react";
import { X } from "lucide-react";

const FuncatiolityViewModalFile = ({ data, onClose }) => {
  const printRef = useRef();

  // ✅ Print
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`
      <html>
        <head>
          <title>Order Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
            .info-row strong { min-width: 120px; display: inline-block; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background: #f3f3f3; }
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[750px] rounded-xl shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Printable Content */}
        <div ref={printRef}>
          <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">
            Order Details
          </h2>

          {/* Info Section */}
          <div className="grid grid-cols-2 gap-y-3 gap-8 text-base mb-6">
            <div>
              <strong>Order ID:</strong> {data.orderId}
            </div>
            <div>
              <strong>Date:</strong>{" "}
              {new Date(data.date).toLocaleDateString()}
            </div>
            <div>
              <strong>Salesman:</strong> {data.salesmanId?.employeeName || "N/A"}
            </div>
            <div>
              <strong>Customer:</strong> {data.customerId?.customerName || "N/A"}
            </div>
            <div>
              <strong>Phone:</strong> {data.customerId?.phoneNumber || "N/A"}
            </div>
            <div>
              <strong>Balance:</strong> {data.customerId?.balance || "N/A"}
            </div>
           
          </div>

          {/* Items Table */}
          <table className="w-full border text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Sr #</th>
                <th className="border px-2 py-1">Product</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Unit</th>
                <th className="border px-2 py-1">Rate</th>
                <th className="border px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {(data.products || data.items || []).map((item, idx) => (
                <tr key={idx} className="text-center">
                  <td className="border px-2 py-1">{idx + 1}</td>
                  <td className="border px-2 py-1">{item.itemName || item.product}</td>
                  <td className="border px-2 py-1">{item.qty}</td>
                  <td className="border px-2 py-1">{item.itemUnit || item.unit}</td>
                  <td className="border px-2 py-1">{item.rate}</td>
                  <td className="border px-2 py-1">{item.totalAmount || item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

        
        </div>

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

export default FuncatiolityViewModalFile;
