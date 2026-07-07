import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboardCards() {

    const [stats, setStats] =
        useState(null);


    useEffect(() => {

        const loadStats =
            async () => {

                try {

                    const res =
                        await API.get(
                            "/admin/dashboard-stats"
                        );

                    setStats(
                        res.data.stats
                    );

                } catch (err) {

                    console.error(err);

                }

            };

        loadStats();

        

    }, []);

    if (!stats) {

        return <p>Loading...</p>;

    }

    return (

        <div className="row">

            <div className="col-md-3">

                <div className="card bg-success text-white">

                    <div className="card-body">

                        <h6>
                            Total Revenue
                        </h6>

                        <h3>
                            ₹
                            {
                                stats.totalRevenue
                            }
                        </h3>

                    </div>

                </div>

            </div>

            <div className="col-md-3">

                <div className="card bg-primary text-white">

                    <div className="card-body">

                        <h6>
                            Online Payments
                        </h6>

                        <h3>
                            ₹
                            {
                                stats.totalOnline
                            }
                        </h3>

                    </div>

                </div>

            </div>

            <div className="col-md-3">

                <div className="card bg-warning">

                    <div className="card-body">

                        <h6>
                            COD Pending
                        </h6>

                        <h3>
                            ₹
                            {
                                stats.codPending
                            }
                        </h3>

                    </div>

                </div>

            </div>

            <div className="col-md-3">

                <div className="card bg-dark text-white">

                    <div className="card-body">

                        <h6>
                            Total Orders
                        </h6>

                        <h3>
                            {
                                stats.totalOrders
                            }
                        </h3>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AdminDashboardCards;