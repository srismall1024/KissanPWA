import { useState } from "react";
import API from "../services/api";
import logo from "../assets/logo.png";

function Register() {
    const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "buyer"
});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(formData.phone)) {

    alert(
        "Phone number must contain exactly 10 digits"
    );

    return;
}

        try {
            const payload = {

    ...formData,

    phone:
        "91" + formData.phone

};

const res =
    await API.post(
        "/auth/register",
        payload
    );

            alert(res.data.message);
            console.log(res.data);

        } catch (err) {
            console.error(err);
            alert("Registration Failed");
        }
    };

    return (
    <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "100vh" }}
  >
    <div
      className="card shadow"
      style={{
        width: "500px",
        maxWidth: "90%",
        backgroundColor: "rgba(255,255,255,0.95)"
      }}
    >
      <div className="card-body">

        <div className="text-center mb-3">
          <img
            src={logo}
            alt="KissanPWA"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "contain"
            }}
          />
        </div>

        <h2 className="text-center mb-4">
          Register
        </h2>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <input
                                    type="text"
                                    name="full_name"
                                    placeholder="Full Name"
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="form-control"
                                    onChange={handleChange}
                                />
                            </div>

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
            className="form-control"
            placeholder="9876543210"
            maxLength="10"
            value={formData.phone}
            onChange={(e) => {

                const value =
                    e.target.value.replace(
                        /\D/g,
                        ""
                    );

                setFormData({
                    ...formData,
                    phone: value
                });

            }}
        />

    </div>

</div>

                            <div className="mb-3">
                                <select
                                    name="role"
                                    className="form-select"
                                    onChange={handleChange}
                                >
                                    <option value="buyer">
                                        Buyer
                                    </option>

                                    <option value="farmer">
                                        Farmer
                                    </option>

                                    <option value="operator">
                                        Operator
                                    </option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success w-100"
                            >
                                Register
                            </button>

                        </form>

                        <div className="text-center mt-3">

                            <a href="/login">
                                Already have an account? Login
                            </a>

                        </div>

                    </div>

                </div>

            </div>
);
}

export default Register;