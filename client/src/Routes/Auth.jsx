import React from "react";

import {createContext, useContext, useState, useEffect} from "react";

const authContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const login = (userData) => setUser(userData);

    const logout = () => setUser(null);

    return (
        <authContext.Provider value ={{user, login, logout}}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => useContext(authContext);