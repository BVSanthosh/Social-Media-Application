import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem("user")) || null);

    useEffect(() => {
        sessionStorage.setItem("user", JSON.stringify(currentUser));
      }, [currentUser]);

    const login = async (inputs) => {
        const res = await axios.post("http://localhost:4000/api/auth/login", inputs, {
            withCredentials: true,
        });

        setCurrentUser(res.data);
    }

    return (
        <AuthContext.Provider value={{currentUser, login}}>
            {children}
        </AuthContext.Provider>
    )
} 
