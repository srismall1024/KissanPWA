import { useState } from "react";
import API from "../services/api";

function RaiseComplaint({ orderId }) {

    const [complaintText, setComplaintText] =
        useState("");

    const submitComplaint = async () => {

        try {

            await API.post(
                "/complaints/create",
                {
                    order_id: orderId,
                    complaint_text: complaintText
                }
            );

            alert("Complaint Submitted");

            setComplaintText("");

        } catch (err) {

            console.error(err);

            alert(
                "Failed to submit complaint"
            );

        }

    };

    return (

        <div className="mt-2">

            <textarea
                className="form-control mb-2"
                rows="2"
                placeholder="Describe your complaint"
                value={complaintText}
                onChange={(e) =>
                    setComplaintText(
                        e.target.value
                    )
                }
            />

            <button
                className="btn btn-danger btn-sm"
                onClick={submitComplaint}
            >
                Submit Complaint
            </button>

        </div>

    );
}

export default RaiseComplaint;