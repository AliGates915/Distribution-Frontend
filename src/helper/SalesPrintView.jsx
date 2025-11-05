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

  // 🧮 Totals
  const totalQty = ledgerEntries.reduce(
    (sum, e) => sum + (parseFloat(e.Qty) || 0),
    0
  );
  const totalAmount = ledgerEntries.reduce(
    (sum, e) => sum + (parseFloat(e.Amount) || 0),
    0
  );
  const totalOverall = ledgerEntries.reduce(
    (sum, e) => sum + (parseFloat(e.Total) || 0),
    0
  );

  // 🪟 Open printable window
  const win = window.open("", "", "width=900,height=700");
  win.document.write(`
    <html>
      <head>
        <title>Supplier Wise Purchase Report</title>
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
        <h2>Supplier-Wise Purchase Report</h2>

        <div style="margin-bottom:10px; font-size:13px;">
          <b>Date:</b> ${new Date().toLocaleDateString()}<br/>
          <b>Supplier:</b> ${firstEntry.SupplierName || "-"}<br/>
        </div>

        <table>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Date</th>
              <th>ID</th>
              <th>Supplier Name</th>
              <th>Item</th>
              <th>Rate</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Total</th>
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
                    <td>${entry.SupplierName || "-"}</td>
                    <td>${entry.Item || "-"}</td>
                    <td>${parseFloat(entry.Rate || 0).toLocaleString()}</td>
                    <td>${parseFloat(entry.Qty || 0).toLocaleString()}</td>
                    <td>${parseFloat(entry.Amount || 0).toLocaleString()}</td>
                    <td>${parseFloat(entry.Total || 0).toLocaleString()}</td>
                  </tr>`
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5" style="text-align:right;">Totals:</td>
              <td>-</td>
              <td>${totalQty.toLocaleString()}</td>
              <td>${totalAmount.toLocaleString()}</td>
              <td>${totalOverall.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <p class="note">
          This is a system-generated supplier-wise purchase report and does not require a signature.
        </p>
      </body>
    </html>
  `);
  win.document.close();
  win.print();
};

export const handleSupplierLedgerPrint = (ledgerEntries = []) => {
  if (!ledgerEntries.length) return;
// console.log({ledgerEntries});

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
        <h2>Supplier Ledger Report</h2>

        <div style="margin-bottom:10px; font-size:13px;">
          <b>Date:</b> ${new Date().toLocaleDateString()}<br/>
          <b>Supplier:</b> ${firstEntry.SupplierName || "-"}<br/>
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

export const handleDateWisePrint = (ledgerEntries = []) => {
  if (!ledgerEntries.length) return;

  const firstEntry = ledgerEntries[0];

  // 🧮 Totals
  const totalAmount = ledgerEntries.reduce(
    (sum, e) => sum + (parseFloat(e.totalAmount) || 0),
    0
  );

  const win = window.open("", "", "width=900,height=700");
  win.document.write(`
    <html>
      <head>
        <title>DateWise Ledger Report</title>
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
        <h2>DateWise Ledger Report</h2>

        <div style="margin-bottom:10px; font-size:13px;">
          <b>Date:</b> ${new Date().toLocaleDateString()}<br/>
          <b>Supplier:</b> ${firstEntry.SupplierName || "-"}<br/>
        </div>

        <table>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Date</th>
              <th>GRN ID</th>
              <th>Item(s)</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${ledgerEntries
              .map(
                (entry, i) => {
                  const item = entry.products?.[0]?.item || "-";
                  const qty = entry.products?.[0]?.qty || 0;
                  const rate = entry.products?.[0]?.rate || 0;
                  const total = entry.totalAmount || 0;
                  const formattedDate = new Date(entry.grnDate).toLocaleDateString("en-GB");

                  return `
                    <tr>
                      <td>${i + 1}</td>
                      <td>${formattedDate}</td>
                      <td>${entry.grnId || "-"}</td>
                      <td>${item}</td>
                      <td>${qty}</td>
                      <td>${rate.toLocaleString()}</td>
                      <td>${total.toLocaleString()}</td>
                    </tr>`;
                }
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="6" style="text-align:right;">Total Amount:</td>
              <td>${totalAmount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <p class="note">
          This is a system-generated Date wise Ledger and does not require a signature.
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
          th, td { border: 1px solid #999; padding: 6px; text-align: center; vertical-align: middle; }
          th { background: #f2f2f2; }
          tfoot td { font-weight: bold; background: #fafafa; }
          .customer-row td { background: #e9f5ff; font-weight: bold; text-align: left; }
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
                (group, i) => `
                  <tr class="customer-row">
                    <td>${i + 1}</td>
                    <td colspan="10">${group.customerName}</td>
                  </tr>
                  ${
                    group.invoices
                      ?.map(
                        (inv) => `
                        <tr>
                          <td></td>
                          <td></td>
                          <td>${inv.invoiceNo || "-"}</td>
                          <td>${inv.deliveryDate || "-"}</td>
                          <td>${inv.allowDays || 0}</td>
                          <td>${inv.billDays || 0}</td>
                          <td>${inv.debit?.toLocaleString() || 0}</td>
                          <td>${inv.credit?.toLocaleString() || 0}</td>
                          <td>${inv.underCredit?.toLocaleString() || 0}</td>
                          <td>${inv.due?.toLocaleString() || 0}</td>
                          <td>${inv.outstanding?.toLocaleString() || 0}</td>
                        </tr>`
                      )
                      .join("") || ""
                  }
                `
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
                      <td>${s.invoiceNo || "-"}</td>
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
