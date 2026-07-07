import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function PaymentPage() {

    const navigate = useNavigate();
    const { state } = useLocation();

    const {
        crop,
        quantity,
        totalAmount
    } = state;

    const [paymentMethod, setPaymentMethod] =
        useState("card");

    const [cardName, setCardName] =
        useState("");

    const [cardNumber, setCardNumber] =
        useState("");

    const [cvv, setCvv] =
        useState("");

    const [upiId, setUpiId] =
        useState("");

    const [transactionId, setTransactionId] =
        useState("");

    const advanceAmount =
        Number(totalAmount) * 0.5;

    const handlePayment = async () => {

        try {

            // CARD VALIDATION

            if (paymentMethod === "card") {

                if (
                    !cardName ||
                    !cardNumber ||
                    !cvv
                ) {

                    alert(
                        "Please fill all card details"
                    );

                    return;
                }
            }

            // UPI VALIDATION

            if (paymentMethod === "upi") {

                if (
                    !upiId ||
                    !transactionId
                ) {

                    alert(
                        "Please enter UPI details"
                    );

                    return;
                }
            }

            // COD AMOUNT

            const payableAmount =
                paymentMethod === "cod"
                    ? advanceAmount
                    : totalAmount;

            const pendingAmount =
    totalAmount - payableAmount;

            await API.post(
    "/orders/create",
    {
        crop_id: crop.crop_id,
        quantity_kg: quantity,
        total_amount: totalAmount,

        payment_method: paymentMethod,
        payment_status:
            paymentMethod === "cod"
                ? "Partial"
                : "Paid",

        paid_amount: payableAmount,
        pending_amount: pendingAmount
    }
);

            alert(
                "Payment Successful"
            );

            navigate(
                "/buyer-dashboard"
            );

        } catch (err) {

            console.error(err);

            alert(
                "Payment Failed"
            );
        }
    };

    return (

        <div className="container mt-5">

            <div className="card shadow">

                <div className="card-header bg-success text-white">

                    Payment Gateway

                </div>

                <div className="card-body">

                    <h4>
                        {crop.crop_name}
                    </h4>

                    <p>
                        Quantity:
                        {" "}
                        {quantity} kg
                    </p>

                    <p>
                        Total Amount:
                        {" "}
                        ₹{totalAmount}
                    </p>

                    <hr />

                    <div className="mb-4">

                        <label className="form-label">

                            Select Payment Method

                        </label>

                        <select
                            className="form-select"
                            value={paymentMethod}
                            onChange={(e) =>
                                setPaymentMethod(
                                    e.target.value
                                )
                            }
                        >

                            <option value="card">

                                Card

                            </option>

                            <option value="upi">

                                UPI

                            </option>

                            <option value="cod">

                                Cash On Delivery

                            </option>

                        </select>

                    </div>

                    {/* CARD PAYMENT */}

                    {
                        paymentMethod === "card" && (

                            <>

                                <div className="mb-3">

                                    <label>

                                        Card Holder Name

                                    </label>

                                    <input
                                        className="form-control"
                                        value={cardName}
                                        onChange={(e) =>
                                            setCardName(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="mb-3">

                                    <label>

                                        Card Number

                                    </label>

                                    <input
                                        className="form-control"
                                        value={cardNumber}
                                        onChange={(e) =>
                                            setCardNumber(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="mb-3">

                                    <label>

                                        CVV

                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={cvv}
                                        onChange={(e) =>
                                            setCvv(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </>
                        )
                    }

                    {/* UPI PAYMENT */}

                    {
                        paymentMethod === "upi" && (

                            <>

                                <div className="mb-3">

                                    <label>

                                        UPI ID

                                    </label>

                                    <input
                                        className="form-control"
                                        placeholder="example@upi"
                                        value={upiId}
                                        onChange={(e) =>
                                            setUpiId(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <div className="mb-3">

                                    <label>

                                        Transaction ID

                                    </label>

                                    <input
                                        className="form-control"
                                        value={transactionId}
                                        onChange={(e) =>
                                            setTransactionId(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </>
                        )
                    }

                    {/* COD */}

                    {
                        paymentMethod === "cod" && (

                            <div className="alert alert-warning">

                                <h5>

                                    Cash On Delivery

                                </h5>

                                <p>

                                    Total Amount:
                                    ₹{totalAmount}

                                </p>

                                <p>

                                    Advance Payment (50%):
                                    ₹{advanceAmount}

                                </p>

                                <p>

                                    Remaining Amount:
                                    ₹{advanceAmount}

                                </p>

                                <small>

                                    Remaining amount must be paid at delivery.

                                </small>

                            </div>
                        )
                    }

                    <button
                        className="btn btn-success"
                        onClick={handlePayment}
                    >

                        Pay Now

                    </button>

                </div>

            </div>

        </div>
    );
}

export default PaymentPage;