import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user was previously logged in
        const checkLoginStatus = async () => {
            try {
                const status = await AsyncStorage.getItem('@is_logged_in');
                if (status === 'true') {
                    setIsAuthenticated(true);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    const login = async () => {
        await AsyncStorage.setItem('@is_logged_in', 'true');
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('@is_logged_in');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);