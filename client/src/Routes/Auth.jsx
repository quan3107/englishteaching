import React from "react";
import axios from "axios";

import {createContext, useContext, useState, useEffect} from "react";

const authContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async() => {
        try {
            const res = await axios.get("http://localhost:3000/api/check-auth", {
                withCredentials: true
            });
            console.log(res.data);
            if (res.data.isAuthenticated) {
                setUser(res.data.userInformation);
                
            } else {
                setUser(null);
            }
        } catch (err) {
            console.log(err);
            setUser(null);
        }
    };
    
    checkAuthStatus();
    console.log(user);
    }, [])

    const login = (userData) => setUser(userData);

    const logout = () => setUser(null);

    return (
        <authContext.Provider value ={{user, login, logout}}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => useContext(authContext);