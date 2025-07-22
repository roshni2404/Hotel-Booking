import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";
import Swal from "sweetalert2";
import "../index.css"; // Optional for custom styles

function Loginscreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    async function login() {
        const user = { email, password };
        try {
            setLoading(true);
            const result = await axios.post("/api/users/login", user);
            setLoading(false);
            setSuccess(true);
            localStorage.setItem("currentUser", JSON.stringify(result.data));

            Swal.fire({
                icon: "success",
                title: "Login Successful",
                showConfirmButton: false,
                timer: 1500,
            });

            setTimeout(() => {
                window.location.href = "/";
            }, 1600);
        } catch (error) {
            console.log(error);
            setError(true);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (localStorage.getItem("currentUser")) {
            window.location.href = "/";
        }
    }, []);

    return (
        <div className="container-fluid login-bg d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f7f9fc" }}>
            <div className="col-md-4 shadow-lg p-5 bg-white rounded-4">
                {loading && <Loader />}
                {error && <Error message="Invalid Credentials" />}
                {success && <Success message="Login Successful" />}

                <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>
                <input
                    type="text"
                    className="form-control w-100 mb-3 p-3 rounded-3"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="form-control w-100 mb-4 p-3 rounded-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn btn-primary w-100 p-2 fw-semibold" onClick={login}>
                    Login
                </button>

                <div className="text-center mt-4">
                    <p className="mb-0 text-muted">
                        Don't have an account? <a href="/register" className="text-decoration-none fw-semibold">Register here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Loginscreen;
