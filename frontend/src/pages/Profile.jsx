import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Profile() {

    const [profile, setProfile] = useState({
        full_name: "",
        email: "",
        phone: "",
        address: "",
        district: "",
        state: "",
        pincode: "",
        role: ""
    });

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const res =
    await API.get(
        "/auth/profile"
    );

                setProfile(res.data.user);

            } catch (err) {

                console.error(err);

                alert("Failed to load profile");

            }

        };

        loadProfile();

    }, []);

    const handleChange = (e) => {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await API.put(
    "/auth/update-profile",
    profile
);

            alert(
                "Profile Updated Successfully"
            );

        } catch (err) {

            console.error(err);

            alert(
                "Failed to update profile"
            );

        }

    };

    return (

        <>
            <Navbar />

            <div className="container mt-4">

                <div className="row justify-content-center">

                    <div className="col-md-8">

                        <div className="card shadow">

                            <div className="card-header bg-success text-white">

                                <h4 className="mb-0">
                                    My Profile
                                </h4>

                            </div>

                            <div className="card-body">

                                <form onSubmit={handleSubmit}>

                                    {/* Full Name */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="full_name"
                                            className="form-control"
                                            value={profile.full_name || ""}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* Email */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={profile.email || ""}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* Phone */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Phone Number
                                        </label>

                                        <div className="input-group">

                                            <span className="input-group-text">
                                                +91
                                            </span>

                                            <input
                                                type="text"
                                                name="phone"
                                                maxLength="10"
                                                className="form-control"
                                                placeholder="9876543210"
                                                value={profile.phone || ""}
                                                onChange={(e) => {

                                                    const value =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            ""
                                                        );

                                                    setProfile({
                                                        ...profile,
                                                        phone: value
                                                    });

                                                }}
                                            />

                                        </div>

                                    </div>

                                    {/* Address */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Address
                                        </label>

                                        <textarea
                                            name="address"
                                            rows="3"
                                            className="form-control"
                                            value={profile.address || ""}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* District */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            District
                                        </label>

                                        <input
                                            type="text"
                                            name="district"
                                            className="form-control"
                                            value={profile.district || ""}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* State */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            State
                                        </label>

                                        <input
                                            type="text"
                                            name="state"
                                            className="form-control"
                                            value={profile.state || ""}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    {/* Pincode */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            name="pincode"
                                            maxLength="6"
                                            className="form-control"
                                            value={profile.pincode || ""}
                                            onChange={(e) => {

                                                const value =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );

                                                setProfile({
                                                    ...profile,
                                                    pincode: value
                                                });

                                            }}
                                        />

                                    </div>

                                    {/* Role */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Role
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            value={profile.role || ""}
                                            readOnly
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-success w-100"
                                    >
                                        Update Profile
                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );

}

export default Profile;