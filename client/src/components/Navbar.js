import React from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa"; // 👈 Font Awesome User Icon

function Navbar() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    function logout() {
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/home">
                        SheyRooms
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon">
                            <i className="fa fa-bars" style={{ color: "white" }}></i>
                        </span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {user ? (
                                <li className="nav-item dropdown">
                                    <button
                                        className="btn btn-dark dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <FaUser className="me-2" />
                                        {user.name}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <Link className="dropdown-item" to="/profile">
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button className="dropdown-item" onClick={logout}>
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">
                                            Register
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">
                                            Login
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
