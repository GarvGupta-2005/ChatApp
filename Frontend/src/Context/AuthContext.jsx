import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)

    //check if the user is authenticated and if yes set his sockey 

    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check")
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            // toast.error(error.message)
            console.log(error)
        }
    }

    //Login Method and authentication

    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials)
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token
                setToken(data.token)
                localStorage.setItem("token", data.token);
                toast.success(data.message)
            } else {
                toast.error(data.message)

            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }

    //Logout function
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setOnlineUsers([]);
        setAuthUser(null);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged Out Successfully")
        socket.disconnect();
    }

    //update profile

    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body)
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully")
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    //connect socket function and gather all online users
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) {
            return;
        }

        const newSocket = io(backendURL, {
            query: {
                userId: userData._id
            }
        })
        newSocket.connect()
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds)
        })
    }



    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token
        }
        checkAuth();
    }, [])

    

    const value = {
        axios, authUser, onlineUsers, socket, login, logout, updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}