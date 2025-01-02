import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/register", {
                username,
                email,
                password,
            });
            alert(res.data.message);
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{marginTop: '50px'}}>
            <h2>Register</h2>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
