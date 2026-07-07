import { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";
import QRCode from "qrcode";

function FarmerOrderSlips() {

    const [invoices, setInvoices] =
        useState([]);

    useEffect(() => {

        const loadInvoices =
            async () => {

                const res =
                    await API.get(
                        "/invoices/farmer"
                    );

                setInvoices(
                    res.data.invoices
                );

            };

        loadInvoices();

    }, []);

    const downloadSlip = async (invoice) => {

    const doc = new jsPDF();

    // Header
    doc.setFillColor(25,135,84);

    doc.rect(
        0,
        0,
        210,
        50,
        "F"
    );

    doc.addImage(
        logo,
        "PNG",
        15,
        10,
        25,
        25
    );

    const qrData =
        await QRCode.toDataURL(
            invoice.invoice_number
        );

    doc.addImage(
        qrData,
        "PNG",
        160,
        8,
        30,
        30
    );

    doc.setTextColor(
        255,
        255,
        255
    );

    doc.setFontSize(20);

    doc.text(
        "FARMER ORDER SLIP",
        65,
        20
    );

    doc.setFontSize(10);

    doc.text(
        "Kissan PWA Agriculture Marketplace",
        55,
        30
    );

    doc.setTextColor(
        0,
        0,
        0
    );

    let y = 65;

    // Order Info

    doc.setFontSize(12);

    doc.text(
        `Order No: ${invoice.order_id}`,
        15,
        y
    );

    y += 8;

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

    // Buyer Details

    doc.setFontSize(14);

    doc.text(
        "BUYER DETAILS",
        15,
        y
    );

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

    // Farmer Details

    doc.setFontSize(14);

    doc.text(
        "FARMER DETAILS",
        15,
        y
    );

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
        `Bank: ${invoice.bank_name || "-"}`,
        15,
        y
    );

    y += 7;

    const maskedAccount =
        invoice.account_number
            ? "XXXXXX" +
              invoice.account_number.slice(-4)
            : "-";

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

    // Order Details

    doc.setFontSize(14);

    doc.text(
        "ORDER DETAILS",
        15,
        y
    );

    y += 10;

    doc.setFontSize(11);

    doc.text(
        `Crop: ${invoice.crop_name}`,
        15,
        y
    );

    y += 7;

    doc.text(
        `Rate: ₹${invoice.price_per_kg}/kg`,
        15,
        y
    );

    y += 7;

    doc.text(
        `Quantity: ${invoice.quantity_kg} kg`,
        15,
        y
    );

    y += 7;

    doc.text(
        `Total Amount: ₹${invoice.total_amount}`,
        15,
        y
    );

    y += 15;

    // Payment Details

    doc.setFontSize(14);

    doc.text(
        "PAYMENT DETAILS",
        15,
        y
    );

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
        `Paid Amount: ₹${invoice.paid_amount}`,
        15,
        y
    );

    y += 7;

    doc.text(
        `Pending Amount: ₹${invoice.pending_amount}`,
        15,
        y
    );

    y += 15;

    doc.line(
        10,
        y,
        200,
        y
    );

    y += 10;

    doc.text(
        "Farmer Copy - Kissan PWA",
        65,
        y
    );

    doc.save(
        `Farmer_OrderSlip_${invoice.invoice_number}.pdf`
    );
};

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-success text-white">

                Farmer Order Slips

            </div>

            <div className="card-body">

                <table className="table table-bordered">

                    <thead>

                        <tr>

                            <th>Order No</th>
                            <th>Buyer</th>
                            <th>Crop</th>
                            <th>Total</th>
                            <th>Payment Mode</th>
                            <th>Status</th>
                            <th>Download</th>

                        </tr>

                    </thead>

                    <tbody>

                        {invoices.map(
                            invoice => (

                            <tr
                                key={
                                    invoice.invoice_id
                                }
                            >

                                <td>
                                    {
                                        invoice.invoice_number
                                    }
                                </td>

                                <td>
                                    {
                                        invoice.buyer_name
                                    }
                                </td>

                                <td>
                                    {
                                        invoice.crop_name
                                    }
                                </td>

                                <td>
                                    ₹{
                                        invoice.total_amount
                                    }
                                </td>

                                <td>
                                    {
                                        invoice.payment_mode
                                    }
                                </td>

                                <td>
                                    {
                                        invoice.payment_status
                                    }
                                </td>

                                <td>

        <button
            className="btn btn-success btn-sm"
            onClick={() => downloadSlip(invoice)}
        >
            Download Slip
        </button>

    </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default FarmerOrderSlips;