import { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import logo from "../assets/logo.png";

function OperatorOrderSlips() {

    const [invoices, setInvoices] =
        useState([]);

    useEffect(() => {

        const loadInvoices =
            async () => {

                try {

                    const res =
                        await API.get(
                            "/invoices/operator"
                        );

                    setInvoices(
                        res.data.invoices
                    );

                } catch(err) {

                    console.error(err);

                }

            };

        loadInvoices();

    }, []);

    const downloadSlip =
        async (invoice) => {

            const doc =
                new jsPDF();

            doc.setFillColor(
                25,
                135,
                84
            );

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

            const checkPageBreak =
                () => {

                    if(y > 260) {

                        doc.addPage();

                        y = 20;

                    }

                };

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
                "Operator Order Slip",
                75,
                30
            );

            doc.setTextColor(
                0,
                0,
                0
            );

            y += 15;

            doc.line(
                10,
                y,
                200,
                y
            );

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

            checkPageBreak();

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
                `Quantity: ${invoice.quantity_kg} Kg`,
                15,
                y
            );

            y += 7;

            doc.text(
                `Rate: Rs.${invoice.price_per_kg}`,
                15,
                y
            );

            y += 7;

            doc.text(
                `Total: Rs.${invoice.total_amount}`,
                15,
                y
            );

            y += 15;

            checkPageBreak();

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
                `Paid: Rs.${invoice.paid_amount}`,
                15,
                y
            );

            y += 7;

            doc.text(
                `Pending: Rs.${invoice.pending_amount}`,
                15,
                y
            );

            y += 15;

            checkPageBreak();

            doc.setFontSize(14);

            doc.text(
                "FARMER PAYMENT ACCOUNT",
                15,
                y
            );

            y += 8;

            const maskedAccount =
                invoice.account_number
                    ? "XXXXXX" +
                      invoice.account_number.slice(-4)
                    : "-";

            doc.setFontSize(11);

            doc.text(
                `Bank: ${invoice.bank_name || "-"}`,
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

            y += 20;

            doc.line(
                10,
                y,
                200,
                y
            );

            y += 15;

            doc.text(
                "Operator Verification",
                140,
                y
            );

            y += 20;

            doc.line(
                130,
                y,
                190,
                y
            );

            y += 7;

            doc.text(
                "Authorized Operator",
                140,
                y
            );

            doc.save(
                `OrderSlip_${invoice.invoice_number}.pdf`
            );

        };

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-primary text-white">

                Operator Order Slips

            </div>

            <div className="card-body">

                <table className="table table-bordered">

                    <thead>

                        <tr>

                            <th>Invoice No</th>
                            <th>Buyer</th>
                            <th>Farmer</th>
                            <th>Crop</th>
                            <th>Total</th>
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
                                        invoice.farmer_name
                                    }
                                </td>

                                <td>
                                    {
                                        invoice.crop_name
                                    }
                                </td>

                                <td>
                                    Rs.
                                    {
                                        invoice.total_amount
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
                                        onClick={() =>
                                            downloadSlip(invoice)
                                        }
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

export default OperatorOrderSlips;