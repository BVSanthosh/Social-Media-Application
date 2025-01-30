import { useState } from "react";
import axios from "axios";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";  

const Register = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [err, setErr] = useState(null);

    const handleChange = (e) => {
        setInputs(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleClick = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post("http://localhost:4000/api/auth/register", inputs);
            navigate("/login");
        } catch (err) {
            setErr(err);
        }
    }

    return (
        <div className="register">
            <div className="card">
                <div className="left">
                    <h1>VSB Social</h1>
                    <p>
                        Enter the world of social media
                    </p>
                    <span>Already have an account?</span>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Register</h1>
                    <form>
                        <input type="text" name="username" placeholder="Username" onChange={handleChange}/>
                        <input type="text" name="email" placeholder="Email" onChange={handleChange} />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                        {err && err.response.data}
                        <button onClick={handleClick}>Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;