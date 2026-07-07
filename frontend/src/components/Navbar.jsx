import { useNavigate, Link } from "react-router-dom";
function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">

            <div className="container">

                <span className="navbar-brand fw-bold" to="/">
                    Kisan PWA
                </span>

                <div className="d-flex align-items-center">

    {user && (
        <>

            <Link
                to="/profile"
                className="btn btn-light btn-sm me-2"
            >
                My Profile
            </Link>

            <span className="badge bg-light text-dark me-3">
                {user.role}
            </span>

            <span className="text-white me-3">
                {user.full_name}
            </span>

            <button
                className="btn btn-danger btn-sm"
                onClick={handleLogout}
            >
                Logout
            </button>

        </>
    )}

</div>

            </div>

        </nav>
    );
}

export default Navbar;