import { useEffect, useState } from "react";
import API from "../services/api";

function SalesHistory() {

    const [sales, setSales] = useState([]);

    useEffect(() => {

        const fetchSales = async () => {

            try {

                const res =
                    await API.get(
                        "/dashboard/sales-history"
                    );

                setSales(res.data.sales);

            } catch (err) {

                console.error(err);

            }
        };

        fetchSales();

    }, []);

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-dark text-white">

                Sales History

            </div>

            <div className="card-body">

                <table className="table table-striped">

                    <thead>

                        <tr>

                            <th>Buyer</th>

                            <th>Crop</th>

                            <th>Quantity</th>

                            <th>Amount</th>

                            <th>Status</th>

                            <th>Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {sales.map((sale) => (

                            <tr
                                key={sale.order_id}
                            >

                                <td>
                                    {sale.buyer_name}
                                </td>

                                <td>
                                    {sale.crop_name}
                                </td>

                                <td>
                                    {sale.quantity_kg} kg
                                </td>

                               <td>₹{sale.total_amount}</td>
<td>₹{sale.paid_amount}</td>
<td>₹{sale.pending_amount}</td>
<td>{sale.payment_status}</td>

                                <td>
                                    {
                                        new Date(
                                            sale.created_at
                                        ).toLocaleDateString()
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

export default SalesHistory;