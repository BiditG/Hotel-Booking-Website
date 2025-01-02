import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/login", {
                email,
                password,
                remember,
            }, { withCredentials: true });
            alert(res.data.message);
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{marginTop: '50px'}}>
            <h2>Login</h2>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <label>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember Me
            </label>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
