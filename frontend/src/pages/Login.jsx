import { useState } from "react";
import API from "../services/api";
import logo from "../assets/logo.png";

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post(
                "/auth/login",
                formData
            );

            console.log(
                "LOGIN RESPONSE:",
                res.data
            );

            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            console.log(
                "USER SAVED:",
                localStorage.getItem("user")
            );

            alert("Login Successful");

            const role = res.data.user.role;

            if (role === "farmer") {

                window.location.href =
                    "/farmer-dashboard";

            } else if (role === "buyer") {

                window.location.href =
                    "/buyer-dashboard";

            } else if (role === "operator") {

                window.location.href =
                    "/admin-dashboard";

            }

        } catch (err) {

            console.error(
                "LOGIN ERROR:",
                err
            );

            if (err.response) {

                console.log(
                    "BACKEND RESPONSE:",
                    err.response.data
                );

            }

            alert("Login Failed");
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
          Login
        </h2>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success w-100"
                            >
                                Login
                            </button>

                        </form>

                        <div className="text-center mt-3">

                            <a href="/">
                                New User? Register Here
                            </a>

                        </div>

                    </div>

                </div>

            </div>
);
}

export default Login;