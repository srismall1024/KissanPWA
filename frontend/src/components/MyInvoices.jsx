import { useEffect, useState } from "react";
import API from "../services/api";

function MyInvoices() {

    const [invoices, setInvoices] =
        useState([]);

    useEffect(() => {

        const loadInvoices =
            async () => {

                const res =
                    await API.get(
                        "/invoices/buyer"
                    );

                setInvoices(
                    res.data.invoices
                );

            };

        loadInvoices();

    }, []);

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-success text-white">

                My Invoices

            </div>

            <div className="card-body">

                <table className="table">

                    <thead>

                        <tr>

                            <th>Invoice No</th>

                            <th>Crop</th>

                            <th>Total</th>

                            <th>Paid</th>

                            <th>Status</th>

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
                                        invoice.crop_name
                                    }
                                </td>

                                <td>
                                    ₹{
                                        invoice.total_amount
                                    }
                                </td>

                                <td>
                                    ₹{
                                        invoice.paid_amount
                                    }
                                </td>

                                <td>
                                    {
                                        invoice.payment_status
                                    }
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default MyInvoices;