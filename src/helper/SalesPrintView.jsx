import Swal from "sweetalert2";

export const handleDirectPrint = (ledgerEntries = []) => {
  if (!ledgerEntries.length) {
    Swal.fire("No Data", "There is no data to print!", "warning");
    return;
  }

  const win = window.open("", "", "width=900,height=700");
  win.document.write(`
    <html>
      <head>
        <title>Sales Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, p { margin: 0; text-align: center; }
          h1 { font-size: 24px; font-weight: bold; color: #333; }
          h2 { font-size: 20px; margin-top: 10px; margin-bottom: 20px;  }
          p { font-size: 14px; color: #555; }
          hr { border: 0; border-top: 1px solid #ccc; margin: 10px 0 20px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background: #f3f3f3; }
        </style>
      </head>
      <body>
        <!-- 🔹 Company Header -->
        <h1>Distribution System Pvt. Ltd.</h1>
        <p>Mall of Lahore, Cantt</p>
        <p>Phone: 0318-4486979</p>
        <hr />

        <!-- 🔹 Report Title -->
        <h2>Sales Report</h2>

        <!-- 🔹 Sales Table -->
        <table>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Order ID</th>
              <th>Date</th>
              <th>Salesman</th>
              <th>Customer</th>
              <th>Supplier</th>
              <th>Product</th>
              <th>Weight</th>
              <th>Purchase Price</th>
              <th>Sale Price</th>
              <th>Qty</th>
              <th>Purchase Total</th>
              <th>Sale Total</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            ${ledgerEntries
              .map(
                (item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${item.orderId || "-"}</td>
                  <td>${new Date(item.date).toLocaleDateString()}</td>
                  <td>${item.salesman || "-"}</td>
                  <td>${item.customer || "-"}</td>
                  <td>${item.supplier || "-"}</td>
                  <td>${item.product || "-"}</td>
                  <td>${item.weight || "-"}</td>
                  <td>${item.purchasePrice || 0}</td>
                  <td>${item.salePrice || 0}</td>
                  <td>${item.qty || 0}</td>
                  <td>${item.purchaseTotal || 0}</td>
                  <td>${item.saleTotal || 0}</td>
                  <td>${(item.saleTotal || 0) - (item.purchaseTotal || 0)}</td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
};




export const handleLedgerPrint = (ledgerEntries = []) => {
  if (!ledgerEntries.length) return;

  const firstEntry = ledgerEntries[0];

  // Totals
  const totalPaid = ledgerEntries.reduce(
    (sum, e) => sum + (parseFloat(e.Paid) || 0),
    0
  );
  const totalReceived = ledgerEntries.reduce(
    (sum, e) => sum + (parseFloat(e.Received) || 0),
    0
  );
  const totalBalance = ledgerEntries.reduce(
    (sum, e) => sum + (parseFloat(e.Balance) || 0),
    0
  );

  const win = window.open("", "", "width=900,height=700");
  win.document.write(`
    <html>
      <head>
        <title>Customer Ledger Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, p { margin: 0; text-align: center; }
          h1 { font-size: 22px; font-weight: bold; }
          h2 { margin-top: 8px; text-decoration: underline; }
          p { font-size: 14px; color: #555; }
          hr { border: none; border-top: 1px solid #aaa; margin: 10px 0 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { border: 1px solid #999; padding: 6px; text-align: center; }
          th { background: #f2f2f2; }
          tfoot td { font-weight: bold; background: #fafafa; }
          .note { font-size: 11px; color: #777; margin-top: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <h1>Distribution System Pvt. Ltd.</h1>
        <p>Mall of Lahore, Cantt</p>
        <p>Phone: 0318-4486979</p>
        <hr />
        <h2>Customer Ledger Report</h2>

        <div style="margin-bottom:10px; font-size:13px;">
          <b>Date:</b> ${new Date().toLocaleDateString()}<br/>
          <b>Customer:</b> ${firstEntry.CustomerName || "-"}<br/>
        </div>

        <table>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Date</th>
              <th>ID</th>
              <th>Description</th>
              <th>Paid</th>
              <th>Received</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            ${ledgerEntries
              .map(
                (entry, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${entry.Date || "-"}</td>
                    <td>${entry.ID || "-"}</td>
                    <td>${entry.Description || "-"}</td>
                    <td>${parseFloat(entry.Paid || 0).toLocaleString()}</td>
                    <td>${parseFloat(entry.Received || 0).toLocaleString()}</td>
                    <td>${parseFloat(entry.Balance || 0).toLocaleString()}</td>
                  </tr>`
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="text-align:right;">Totals:</td>
              <td>${totalPaid.toLocaleString()}</td>
              <td>${totalReceived.toLocaleString()}</td>
              <td>${totalBalance.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <p class="note">
          This is a system-generated ledger report and does not require a signature.
        </p>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
};





export const handleCreditAgingPrint = (apiData = [], totals = {}) => {
  const win = window.open("", "", "width=900,height=700");
  win.document.write(`
    <html>
      <head>
        <title>Credit Aging Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, p { margin: 0; text-align: center; }
          h1 { font-size: 22px; font-weight: bold; }
          h2 { margin-top: 8px; text-decoration: underline; }
          p { font-size: 14px; color: #555; }
          hr { border: none; border-top: 1px solid #aaa; margin: 10px 0 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { border: 1px solid #999; padding: 6px; text-align: center; }
          th { background: #f2f2f2; }
          tfoot td { font-weight: bold; background: #fafafa; }
          .note { font-size: 11px; color: #777; margin-top: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <h1>Distribution System Pvt. Ltd.</h1>
        <p>Mall of Lahore, Cantt</p>
        <p>Phone: 0318-4486979</p>
        <hr />
        <h2>Credit Aging Report</h2>

        <table>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Customer</th>
              <th>Invoice No</th>
              <th>Delivery Date</th>
              <th>Allow Days</th>
              <th>Bill Days</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Under Credit</th>
              <th>Due</th>
              <th>Outstanding</th>
            </tr>
          </thead>
          <tbody>
            ${apiData
              .map(
                (row, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${row.customerName || "-"}</td>
                    <td>${row.invoiceNo || "-"}</td>
                    <td>${row.deliveryDate || "-"}</td>
                    <td>${row.allowDays || 0}</td>
                    <td>${row.billDays || 0}</td>
                    <td>${row.debit?.toLocaleString() || 0}</td>
                    <td>${row.credit?.toLocaleString() || 0}</td>
                    <td>${row.underCredit?.toLocaleString() || 0}</td>
                    <td>${row.due?.toLocaleString() || 0}</td>
                    <td>${row.outstanding?.toLocaleString() || 0}</td>
                  </tr>`
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6" style="text-align:right;">Totals:</td>
              <td>${(totals.totalDebit || 0).toLocaleString()}</td>
              <td>${(totals.totalCredit || 0).toLocaleString()}</td>
              <td>${(totals.totalUnderCredit || 0).toLocaleString()}</td>
              <td>${(totals.totalDue || 0).toLocaleString()}</td>
              <td>${(totals.totalOutstanding || 0).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <p class="note">
          This is a system-generated credit aging report and does not require a signature.
        </p>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
};




export const handleDailySalesPrint = (salesmanList = {}, selectedSalesmanName = "") => {
  if (
    !salesmanList ||
    (!salesmanList.salesItems?.length &&
      !salesmanList.paymentReceived?.length &&
      !salesmanList.recoveries?.length)
  ) {
   
    return;
  }

  const { salesItems = [], paymentReceived = [], recoveries = [] } = salesmanList;

  // Totals
  const totalSales = salesItems.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalPayment = paymentReceived.reduce((sum, p) => sum + (p.total || 0), 0);
  const totalReceived = paymentReceived.reduce((sum, p) => sum + (p.received || 0), 0);
  const totalBalance = paymentReceived.reduce((sum, p) => sum + (p.balance || 0), 0);
  const totalDueRecovery = recoveries.reduce((sum, r) => sum + (r.dueRecovery || 0), 0);

  const win = window.open("", "", "width=950,height=700");
  win.document.write(`
    <html>
      <head>
        <title>Daily Sales Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, p { margin: 0; text-align: center; }
          h1 { font-size: 22px; font-weight: bold; }
          h2 { margin-top: 8px; text-decoration: underline; }
          hr { border: none; border-top: 1px solid #aaa; margin: 10px 0 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { border: 1px solid #999; padding: 6px; text-align: center; }
          th { background: #f2f2f2; }
          tfoot td { font-weight: bold; background: #fafafa; }
          .note { font-size: 11px; color: #777; margin-top: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <h1>Distribution System Pvt. Ltd.</h1>
        <p>Mall of Lahore, Cantt</p>
        <p>Phone: 0318-4486979</p>
        <hr />
        <h2>Daily Sales Report</h2>
        <p><b>Date:</b> ${new Date().toLocaleDateString()} &nbsp;&nbsp; | &nbsp;&nbsp; <b>Salesman:</b> ${selectedSalesmanName || "-"}</p>

        <!-- 🔹 Sales Items Table -->
        <h3 style="margin-top:20px;">Sales Items</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Item Name</th>
              <th>Rate</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${
              salesItems.length
                ? salesItems
                    .map(
                      (s) => `
                    <tr>
                      <td>${s.orderId || "-"}</td>
                      <td>${s.itemName || "-"}</td>
                      <td>${s.rate || 0}</td>
                      <td>${s.qty || 0}</td>
                      <td>${(s.total || 0).toLocaleString()}</td>
                    </tr>`
                    )
                    .join("")
                : `<tr><td colspan="5">No sales records found.</td></tr>`
            }
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="text-align:right;">Total:</td>
              <td>${totalSales.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <!-- 🔹 Payment Received Table -->
        <h3 style="margin-top:25px;">Payment Received</h3>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total</th>
              <th>Received</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            ${
              paymentReceived.length
                ? paymentReceived
                    .map(
                      (p) => `
                    <tr>
                      <td>${p.customerName || "-"}</td>
                      <td>${(p.total || 0).toLocaleString()}</td>
                      <td>${(p.received || 0).toLocaleString()}</td>
                      <td>${(p.balance || 0).toLocaleString()}</td>
                    </tr>`
                    )
                    .join("")
                : `<tr><td colspan="4">No payments found.</td></tr>`
            }
          </tbody>
          <tfoot>
            <tr>
              <td style="text-align:right;">Totals:</td>
              <td>${totalPayment.toLocaleString()}</td>
              <td>${totalReceived.toLocaleString()}</td>
              <td>${totalBalance.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <!-- 🔹 Recovery Table -->
        <h3 style="margin-top:25px;">Recovery</h3>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Invoice No</th>
              <th>Order ID</th>
              <th>Total Bill</th>
              <th>Recovered</th>
              <th>Due Recovery</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${
              recoveries.length
                ? recoveries
                    .map(
                      (r) => `
                    <tr>
                      <td>${r.customerName || "-"}</td>
                      <td>${r.invoiceNo || "-"}</td>
                      <td>${r.orderId || "-"}</td>
                      <td>${(r.totalBill || 0).toLocaleString()}</td>
                      <td>${(r.recovered || 0).toLocaleString()}</td>
                      <td>${(r.dueRecovery || 0).toLocaleString()}</td>
                      <td>${r.status || "-"}</td>
                    </tr>`
                    )
                    .join("")
                : `<tr><td colspan="7">No recoveries found.</td></tr>`
            }
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" style="text-align:right;">Total Due Recovery:</td>
              <td colspan="2">${totalDueRecovery.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <p class="note">
          This is a system-generated report and does not require a signature.
        </p>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
};
