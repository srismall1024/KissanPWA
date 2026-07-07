import { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";
import QRCode from "qrcode";

function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await API.get("/invoices/buyer");
        setInvoices(res.data.invoices);
        console.log(res.data.invoices);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInvoices();
  }, []);

  const downloadInvoice = async (invoice) => {

    const doc = new jsPDF();

    const checkPageBreak = () => {

    if (y > 260) {

        doc.addPage();

        y = 20;
    }
};

    doc.setFillColor(25,135,84);

doc.rect(
    0,
    0,
    210,
    60,
    "F"
);

    doc.addImage(
    logo,
    "PNG",
    15,
    10,
    30,
    30
);

const qrData =
        await QRCode.toDataURL(
            invoice.invoice_number
        );

    doc.addImage(
        qrData,
        "PNG",
         155,
    10,
    35,
    35
    );

    let y = 70;

doc.setTextColor(
    255,
    255,
    255
);

doc.setFontSize(22);

doc.text(
    "KISSAN PWA",
    70,
    20
);

doc.setFontSize(11);

doc.text(
    "Digital Agriculture Marketplace",
    60,
    30
);

doc.setTextColor(
    0,
    0,
    0
);

    y += 15;

    doc.line(10, y, 200, y);

    y += 10;

    doc.setFontSize(12);

    doc.text(
        `Invoice No: ${invoice.invoice_number}`,
        15,
        y
    );

    y += 8;

    doc.text(
        `Date: ${new Date(
            invoice.invoice_date
        ).toLocaleDateString()}`,
        15,
        y
    );

    y += 15;

    checkPageBreak();

    doc.setFontSize(14);
    doc.text("BUYER DETAILS", 15, y);

    y += 8;

    doc.setFontSize(11);

    doc.text(
        `Name: ${invoice.buyer_name}`,
        15,
        y
    );

    y += 7;

    doc.text(
    `Email: ${invoice.buyer_email}`,
    15,
    y
);

y += 7;

doc.text(
    `Phone: +91 ${invoice.buyer_phone || "-"}`,
    15,
    y
);

y += 7;

doc.text(
    `Address: ${invoice.buyer_address || "-"}`,
    15,
    y
);

y += 7;

doc.text(
    `District: ${invoice.buyer_district || "-"}`,
    15,
    y
);

y += 7;

doc.text(
    `State: ${invoice.buyer_state || "-"}`,
    15,
    y
);

y += 7;

doc.text(
    `Pincode: ${invoice.buyer_pincode || "-"}`,
    15,
    y
);

y += 15;

    y += 15;

    checkPageBreak();

    doc.setFontSize(14);
    doc.text("FARMER DETAILS", 15, y);

    y += 8;

    doc.setFontSize(11);

    doc.text(
        `Name: ${invoice.farmer_name}`,
        15,
        y
    );

    y += 7;

    doc.text(
    `Email: ${invoice.farmer_email}`,
    15,
    y
);

y += 7;

doc.text(
    `Phone: +91 ${invoice.farmer_phone || "-"}`,
    15,
    y
);

    y += 7;

    doc.text(
        `Location: ${invoice.farmer_location}`,
        15,
        y
    );

    y += 7;

doc.text(
    `Address: ${invoice.farmer_address || "-"}`,
    15,
    y
);

y += 7;

doc.text(
    `District: ${invoice.farmer_district || "-"}`,
    15,
    y
);

y += 7;

doc.text(
    `State: ${invoice.farmer_state || "-"}`,
    15,
    y
);

y += 7;

doc.text(
    `Pincode: ${invoice.farmer_pincode || "-"}`,
    15,
    y
);

    y += 15;

    checkPageBreak();

    doc.setFontSize(14);
    doc.text("ITEM DETAILS", 15, y);

    y += 10;

    doc.setFontSize(11);

    doc.text("Crop", 15, y);
    doc.text("Qty", 85, y);
    doc.text("Rate", 125, y);
    doc.text("Amount", 165, y);

    y += 3;

    doc.line(15, y, 190, y);

    y += 8;

    doc.text(
        invoice.crop_name,
        15,
        y
    );

    doc.text(
        `${invoice.quantity_kg} kg`,
        85,
        y
    );

    doc.text(
        `Rs.${invoice.price_per_kg}`,
        125,
        y
    );

    doc.text(
        `Rs.${invoice.total_amount}`,
        165,
        y
    );

    y += 15;

    checkPageBreak();

    doc.setFontSize(14);
    doc.text("PAYMENT DETAILS", 15, y);

    y += 8;

    doc.setFontSize(11);

    doc.text(
        `Mode: ${invoice.payment_mode}`,
        15,
        y
    );

    y += 7;

    doc.text(
        `Status: ${invoice.payment_status}`,
        15,
        y
    );

    y += 7;

    doc.text(
        `Paid Amount: Rs.${invoice.paid_amount}`,
        15,
        y
    );

    y += 7;

    doc.text(
        `Pending Amount: Rs.${invoice.pending_amount}`,
        15,
        y
    );

    y+=15;

    checkPageBreak();

    doc.setFontSize(14);

doc.text(
    "PAY TO FARMER",
    15,
    y
);

y += 8;

const maskedAccount =
    invoice.account_number &&
    invoice.account_number.length >= 4
        ? "XXXXXX" +
          invoice.account_number.slice(-4)
        : "-";

doc.setFontSize(11);

doc.text(
    `Bank Name: ${invoice.bank_name || "-"}`,
    15,
    y
);

y += 7;

doc.text(
    `Account: ${maskedAccount}`,
    15,
    y
);

y += 7;

doc.text(
    `IFSC: ${invoice.ifsc_code || "-"}`,
    15,
    y
);

y += 7;

doc.text(
    `UPI: ${invoice.upi_id || "-"}`,
    15,
    y
);

y += 15;

doc.line(10, y, 200, y);

    y += 15;

    doc.setFontSize(15);

    doc.text(
        `GRAND TOTAL : Rs.${invoice.total_amount}`,
        120,
        y
    );

    y += 15;

    doc.line(10, y, 200, y);

    y += 10;

    doc.setFontSize(11);

    doc.text(
    `For issues contact: ${invoice.operator_email}`,
    15,
    y
);

y += 10;

    doc.text(
        "Thank you for using KissanPWA",
        55,
        y
    );

    doc.save(
        `${invoice.invoice_number}.pdf`
    );
};

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-dark text-white">My Invoices</div>
      <div className="card-body">
        {invoices.length === 0 ? (
          <p>No invoices found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Crop</th>
                <th>Total Amount</th>
                <th>Payment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.invoice_id}>
                  <td>{invoice.invoice_number}</td>
                  <td>{invoice.crop_name}</td>
                  <td>Rs.{invoice.total_amount}</td>
                  <td>{invoice.payment_status}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => downloadInvoice(invoice)}
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default InvoiceHistory;