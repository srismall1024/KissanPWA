import { useEffect, useState } from "react";
import API from "../services/api";
import RaiseComplaint
from "./RaiseComplaint";

function MyOrders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const loadOrders = async () => {
            try {
                const res = await API.get("/orders/buyer-paid-orders")
                const user = JSON.parse(localStorage.getItem("user"));
                const buyerOrders = res.data.orders.filter(
                    (order) => order.buyer_id === user.user_id
                );
                if (isMounted) setOrders(buyerOrders);
            } catch (err) {
                console.error(err);
            }
        };

        void loadOrders();

        return () => {
            isMounted = false;
        };
    }, []);

    const cancelOrder = async (orderId) => {

    try {

        await API.put(
    `/orders/${orderId}/cancel`
        );

        alert("Order Cancelled");

        setOrders((prev) =>
            prev.map((order) =>
                order.order_id === orderId
                    ? {
                          ...order,
                          status: "Cancelled"
                      }
                    : order
            )
        );

    } catch (err) {

        console.error(err);

        alert("Failed to cancel order");
    }
};

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-primary text-white">

                My Orders

            </div>

            <div className="card-body">

                <div className="table-responsive">

                    <table className="table table-bordered table-hover">

                        <thead>

                            <tr>
                                <th>Order ID</th>
                                <th>Crop ID</th>
                                <th>Quantity (kg)</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                                <th>Complaint</th>
                            </tr>

                        </thead>

                        <tbody>

                            {orders.length > 0 ? (

                                orders.map((order) => (

                                    <tr key={order.order_id}>

                                        <td>
                                            {order.order_id}
                                        </td>

                                        <td>
                                            {order.crop_id}
                                        </td>

                                        <td>
                                            {order.quantity_kg}
                                        </td>

                                        <td>
                                            ₹{order.total_amount}
                                        </td>

                                        <td>

                                            <span
                                                className={`badge ${
    order.status === "Delivered"
        ? "bg-success"
        : order.status === "Pending"
        ? "bg-warning text-dark"
        : order.status === "Cancelled"
        ? "bg-danger"
        : "bg-info"
}`}
                                            >
                                                {order.status}
                                            </span>

                                        </td>

                                        <td>

    {(order.status === "Pending" ||
      order.status === "Approved") ? (

        <button
            className="btn btn-danger btn-sm"
            onClick={() =>
                cancelOrder(
                    order.order_id
                )
            }
        >
            Cancel Order
        </button>

    ) : (

        <span className="text-muted">
            Not Allowed
        </span>

    )}

</td>

<td>

    {
        order.status === "Delivered" ? (

            <RaiseComplaint
                orderId={order.order_id}
            />

        ) : (

            <span className="text-muted">
                Available after delivery
            </span>

        )
    }

</td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center"
                                    >
                                        No Orders Found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );
}

export default MyOrders;