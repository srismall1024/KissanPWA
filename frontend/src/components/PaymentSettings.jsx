import { useState } from "react";
import API from "../services/api";

function PaymentSettings() {

    const [bankName, setBankName] =
        useState("");

    const [accountNumber, setAccountNumber] =
        useState("");

    const [ifscCode, setIfscCode] =
        useState("");

    const [upiId, setUpiId] =
        useState("");

    const saveDetails = async () => {

        try {

            await API.put(
                "/users/payment-details",
                {
                    bank_name: bankName,
                    account_number: accountNumber,
                    ifsc_code: ifscCode,
                    upi_id: upiId
                }
            );

            alert(
                "Payment Details Saved"
            );

        } catch (err) {

            console.error(err);

            alert(
                "Failed To Save"
            );

        }
    };

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-success text-white">

                Payment Settings

            </div>

            <div className="card-body">

                <div className="mb-3">

                    <label>
                        Bank Name
                    </label>

                    <input
                        className="form-control"
                        value={bankName}
                        onChange={(e) =>
                            setBankName(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="mb-3">

                    <label>
                        Account Number
                    </label>

                    <input
                        className="form-control"
                        value={accountNumber}
                        onChange={(e) =>
                            setAccountNumber(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="mb-3">

                    <label>
                        IFSC Code
                    </label>

                    <input
                        className="form-control"
                        value={ifscCode}
                        onChange={(e) =>
                            setIfscCode(
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="mb-3">

                    <label>
                        UPI ID
                    </label>

                    <input
                        className="form-control"
                        value={upiId}
                        onChange={(e) =>
                            setUpiId(
                                e.target.value
                            )
                        }
                    />

                </div>

                <button
                    className="btn btn-success"
                    onClick={saveDetails}
                >
                    Save Details
                </button>

            </div>

        </div>

    );
}

export default PaymentSettings;