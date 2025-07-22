import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function Registerscreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState(false);

    async function register() {
        if (password !== cpassword) {
            alert("Passwords do not match");
            return;
        }

        const user = { name, email, password };
        try {
            setLoading(true);
            await axios.post("/api/users/register", user);
            setLoading(false);
            setSuccess(true);
            setName("");
            setEmail("");
            setPassword("");
            setCpassword("");
        } catch (error) {
            console.log(error);
            setError(true);
            setLoading(false);
        }
    }

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: "90vh", background: "#f1f3f6" }}>
            <div className="col-11 col-sm-9 col-md-6 col-lg-5 col-xl-4 shadow-lg p-5 bg-white rounded-4">
                {loading && <Loader />}
                {error && <Error message="Registration failed" />}
                {success && <Success message="Registration successful!" />}

                <h2 className="text-center mb-4 fw-bold">Create Account</h2>

                <input
                    type="text"
                    className="form-control w-100 p-3 mb-3 rounded-3"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    className="form-control w-100 p-3 mb-3 rounded-3"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="form-control w-100 p-3 mb-3 rounded-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    className="form-control w-100 p-3 mb-4 rounded-3"
                    placeholder="Confirm Password"
                    value={cpassword}
                    onChange={(e) => setCpassword(e.target.value)}
                />

                <button className="btn btn-primary w-100 py-2 fw-semibold" onClick={register}>
                    Register
                </button>

                <div className="text-center mt-4">
                    <p className="text-muted">
                        Already have an account?{" "}
                        <a href="/login" className="text-decoration-none fw-semibold text-primary">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Registerscreen;
