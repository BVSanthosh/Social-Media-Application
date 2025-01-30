import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

const Login = () => {
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    });
    
    const [err, setErr] = useState(null);

    const handleChange = (e) => {
        setInputs(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
        

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await login(inputs);
            navigate("/");
        } catch (err) {
            setErr(err);
        }
    }

    return (
        <div className="login">
            <div className="card">
                <div className="left">
                    <h1>Welcome</h1>
                    <p>
                        Re-enter the world of social media
                    </p>
                    <span>Don't have an account?</span>
                    <Link to="/register">
                        <button>Register</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Login</h1>
                    <form>
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                        <button onClick={handleLogin}>Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;