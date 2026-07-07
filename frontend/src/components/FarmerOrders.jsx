import { useEffect, useState } from "react";
import API from "../services/api";

function FarmerOrders() {

    const [orders, setOrders] =
        useState([]);

    const loadOrders =
        async () => {

        try {

            const res =
                await API.get(
                    "/orders/farmer/orders"
                );

            setOrders(
                res.data.orders
            );

        } catch (err) {

            console.error(err);
        }
    };

    useEffect(() => {

        const fetchOrders = async () => {
            try {
                const res = await API.get(
                    "/orders/farmer/orders"
                );

                setOrders(
                    res.data.orders
                );
            } catch (err) {
                console.error(err);
            }
        };

        fetchOrders();

    }, []);

    const updateStatus =
        async (
            orderId,
            status
        ) => {

        try {

            await API.put(
                `/orders/${orderId}/status`,
                { status }
            );

            loadOrders();

        } catch (err) {

            console.error(err);
        }
    };

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-success text-white">

                Incoming Orders

            </div>

            <div className="card-body">

                <table className="table table-bordered">

                    <thead>

                        <tr>

                            <th>
                                Order ID
                            </th>

                            <th>
                                Crop
                            </th>

                            <th>
                                Quantity
                            </th>

                            <th>
                                Amount
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {orders.map(
                            (order) => (

                            <tr
                                key={
                                    order.order_id
                                }
                            >

                                <td>
                                    {
                                        order.order_id
                                    }
                                </td>

                                <td>
                                    {
                                        order.crop_name
                                    }
                                </td>

                                <td>
                                    {
                                        order.quantity_kg
                                    } kg
                                </td>

                                <td>
                                    ₹
                                    {
                                        order.total_amount
                                    }
                                </td>

                                <td>
                                    {
                                        order.status
                                    }
                                </td>

                                <td>

                                    <select
                                        className="form-select"
                                        value={
                                            order.status
                                        }
                                        onChange={(e)=>
                                            updateStatus(
                                                order.order_id,
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Approved">
                                            Approved
                                        </option>

                                        <option value="Rejected">
                                            Rejected
                                        </option>

                                        <option value="Shipped">
                                            Shipped
                                        </option>

                                        <option value="Delivered">
                                            Delivered
                                        </option>

                                    </select>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default FarmerOrders;