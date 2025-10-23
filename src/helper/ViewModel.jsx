import React, { useRef } from "react";
import { X } from "lucide-react";

const ViewModal = ({ type, data, onClose }) => {
  const printRef = useRef();

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
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const handlePDF = () => {
    alert("PDF export coming soon 🚀");
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

        <div ref={printRef}>
          <h2 className="text-2xl font-bold mb-6 text-center border-b pb-2">
            {type === "loadsheet"
              ? "Loadsheet Details"
              : type === "order"
              ? "Order Details"
              : type === "invoice"
              ? "Invoice Details"
              : type === "productwise"
              ? "Product-Wise Invoice Details"
              : type === "salesmanwise"
              ? "Salesman-Wise Invoice Details"
              : type === "customerwise"
              ? "Customer-Wise Invoice Details"
              : "Details"}
          </h2>

          <div className="grid grid-cols-2 gap-4 text-base mb-6">
            {type === "customerwise" && (
              <>
                <div><strong>Invoice No:</strong> {data.invoiceNo}</div>
                <div><strong>Invoice Date:</strong> {new Date(data.invoiceDate).toLocaleDateString()}</div>
                <div><strong>Customer:</strong> {data.orderTakingId?.customerId?.customerName}</div>
                <div><strong>Customer Phone:</strong> {data.orderTakingId?.customerId?.phoneNumber}</div>
                <div><strong>Salesman:</strong> {data.salesmanId?.employeeName}</div>
                <div><strong>Order ID:</strong> {data.orderTakingId?.orderId}</div>
                <div><strong>Total Quantity:</strong> {data.totalQty}</div>
                <div><strong>Total Amount:</strong> Rs. {data.totalAmount?.toLocaleString()}</div>
                <div><strong>Status:</strong> {data.status}</div>
              </>
            )}
          </div>

          <table className="w-full border text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th>Sr #</th>
                {(type === "invoice" ||
                  type === "productwise" ||
                  type === "salesmanwise" ||
                  type === "customerwise") && <th>Category</th>}
                <th>Item</th>
                {(type === "invoice" ||
                  type === "productwise" ||
                  type === "salesmanwise" ||
                  type === "customerwise") ? (
                  <>
                    <th>Issue</th>
                    <th>Sold</th>
                    <th>Return</th>
                  </>
                ) : (
                  <th>Qty</th>
                )}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(data.products || []).map((item, idx) => (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  {(type === "invoice" ||
                    type === "productwise" ||
                    type === "salesmanwise" ||
                    type === "customerwise") && (
                    <td className="text-center">{item.categoryName || "-"}</td>
                  )}
                  <td className="text-center">{item.itemName || item.item}</td>
                  {(type === "invoice" ||
                    type === "productwise" ||
                    type === "salesmanwise" ||
                    type === "customerwise") ? (
                    <>
                      <td className="text-center">{item.issue || 0}</td>
                      <td className="text-center">{item.sold || 0}</td>
                      <td className="text-center">{item.return || 0}</td>
                    </>
                  ) : (
                    <td className="text-center">{item.qty || item.issues}</td>
                  )}
                  <td className="text-center">
                    {item.totalAmount ? item.totalAmount.toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
