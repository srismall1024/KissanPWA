import { useEffect, useState } from "react";
import API from "../services/api";

function ComplaintHistory() {

    const [complaints, setComplaints] =
        useState([]);

    useEffect(() => {

        const loadComplaints = async () => {

            try {

                const user =
                    JSON.parse(
                        localStorage.getItem(
                            "user"
                        )
                    );

                const res =
                    await API.get(
                        "/complaints"
                    );

                const buyerComplaints =
                    res.data.complaints.filter(
                        (complaint) =>
                            complaint.buyer_id ===
                            user.user_id
                    );

                setComplaints(
                    buyerComplaints
                );

            } catch (err) {

                console.error(err);
            }
        };

        loadComplaints();

    }, []);

    return (

        <div className="card shadow mt-4">

            <div className="card-header bg-danger text-white">

                Complaint History

            </div>

            <div className="card-body">

                <div className="table-responsive">

                    <table className="table table-bordered">

                        <thead>

                            <tr>

                                <th>
                                    Complaint ID
                                </th>

                                <th>
                                    Order ID
                                </th>

                                <th>
                                    Complaint
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {complaints.length > 0 ? (

                                complaints.map(
                                    (complaint) => (

                                    <tr
                                        key={
                                            complaint.complaint_id
                                        }
                                    >

                                        <td>
                                            {
                                                complaint.complaint_id
                                            }
                                        </td>

                                        <td>
                                            {
                                                complaint.order_id
                                            }
                                        </td>

                                        <td>
                                            {
                                                complaint.complaint_text
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={`badge ${
                                                    complaint.status === "Resolved"
                                                        ? "bg-success"
                                                        : complaint.status === "Rejected"
                                                        ? "bg-danger"
                                                        : complaint.status === "Under Review"
                                                        ? "bg-warning text-dark"
                                                        : "bg-primary"
                                                }`}
                                            >

                                                {
                                                    complaint.status
                                                }

                                            </span>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="text-center"
                                    >

                                        No Complaints Found

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

export default ComplaintHistory;