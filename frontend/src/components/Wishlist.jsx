import { useEffect, useState }
from "react";

import API
from "../services/api";

function Wishlist() {

    const [items, setItems] =
        useState([]);

    const fetchWishlist =
        async () => {

            try {

                const res =
                    await API.get(
                        "/wishlist"
                    );

                setItems(
                    res.data.items
                );

            } catch (err) {

                console.error(err);

            }
        };

    useEffect(() => {

        const loadWishlist = async () => {
            await fetchWishlist();
        };

        loadWishlist();

    }, []);

    const removeWishlist =
        async (wishlistId) => {

            try {

                await API.delete(
                    `/wishlist/${wishlistId}`
                );

                fetchWishlist();

            } catch (err) {

                console.error(err);

            }
        };

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-danger text-white">

                My Wishlist

            </div>

            <div className="card-body">

                <div className="row">

                    {items.map(item => (

                        <div
                            className="col-md-4 mb-3"
                            key={
                                item.wishlist_id
                            }
                        >

                            <div className="card h-100">

                                {item.image_url && (

                                    <img
                                        src={`http://localhost:5000${item.image_url}`}
                                        alt={
                                            item.crop_name
                                        }
                                        className="card-img-top"
                                        style={{
                                            height: "200px",
                                            objectFit:
                                                "cover"
                                        }}
                                    />

                                )}

                                <div className="card-body">

                                    <h5>
                                        {
                                            item.crop_name
                                        }
                                    </h5>

                                    <p>

                                        ₹
                                        {
                                            item.price_per_kg
                                        }
                                        /kg

                                    </p>

                                    <p>

                                        Available:
                                        {" "}
                                        {
                                            item.quantity_kg
                                        }
                                        kg

                                    </p>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                            removeWishlist(
                                                item.wishlist_id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );
}

export default Wishlist;