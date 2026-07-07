import { useEffect, useState } from "react";
import API from "../services/api";

function Cart() {

    const [cart, setCart] = useState([]);

    const loadCart = async () => {

        try {

            const res =
                await API.get("/cart");

            setCart(res.data.cart);

        } catch (err) {

            console.error(err);

        }
    };

    useEffect(() => {

        const fetchCart = async () => {
            await loadCart();
        };

        fetchCart();

    }, []);

    const removeItem = async (id) => {

        try {

            await API.delete(
                `/cart/${id}`
            );

            loadCart();

        } catch (err) {

            console.error(err);

        }
    };

    const updateQuantity = async (
    cartId,
    currentQty,
    change
) => {

    const newQty =
    Number(currentQty) + Number(change);

    if (newQty <= 0) return;

    try {

        await API.put(
            `/cart/${cartId}`,
            {
                quantity_kg: newQty
            }
        );

        loadCart();

    } catch (err) {

        console.error(err);

    }
};

    const checkoutCart = async () => {

    try {

        await API.post(
            "/cart/checkout"
        );

        alert(
            "Checkout Successful"
        );

        loadCart();

    } catch (err) {

        console.error(err);

        alert(
            "Checkout Failed"
        );

    }
};

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-success text-white">

                Shopping Cart

            </div>

            <div className="card-body">

                <table className="table">

                    <thead>

                        <tr>

                            <th>Crop</th>

                            <th>Qty</th>

                            <th>Price</th>

                            <th>Action</th>

                            <th>Available Stock</th>

                        </tr>

                    </thead>

                    <tbody>

                        {cart.map((item) => (

                            <tr
                                key={item.cart_id}
                            >

                                <td>
                                    {item.crop_name}
                                </td>

                                <td>

    <button
        className="btn btn-sm btn-secondary me-2"
        onClick={() =>
            updateQuantity(
                item.cart_id,
                item.quantity_kg,
                -1
            )
        }
    >
        -
    </button>

    {item.quantity_kg}

    <button
        className="btn btn-sm btn-secondary ms-2"
        onClick={() =>
            updateQuantity(
                item.cart_id,
                item.quantity_kg,
                1
            )
        }
    >
        +
    </button>

</td>

                                <td>
                                    ₹
                                    {
                                        Number(
                                            item.price_per_kg
                                        ) *
                                        Number(
                                            item.quantity_kg
                                        )
                                    }
                                </td>

                                <td>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                            removeItem(
                                                item.cart_id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </td>

                                <td>
    {item.available_stock} kg
</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

                <div className="text-end">

    <button
        className="btn btn-success"
        onClick={checkoutCart}
    >
        Checkout All
    </button>

</div>

            </div>

        </div>

    );
}

export default Cart;