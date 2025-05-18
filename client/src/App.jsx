import "./App.css";
import Navbar from "./components/Navbar";
import { Container, Typography, Paper } from "@mui/material";
import Footer from "./components/Footer";
import Course from "./components/Course";
import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomeLogin from "./pages/HomeLogin";
import { useAuth, AuthProvider } from "./Routes/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardNavbar from "./components/DashboardNavbar";
import DashboardOverview from "./components/DashboardOverview"; // Import DashboardOverview


function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <HomeLogin /> : <Home />} />
      <Route path="/login" element={user ? <Navigate replace to = "/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate replace to = "/" /> : <Signup />} />
      <Route path="/dashboard" element={user ? <DashboardNavbar /> : <Navigate replace to= "/login" />}>
        <Route index element={<Navigate replace to = "overview" />} />
        <Route path="overview" element={<DashboardOverview />} />
        <Route path="courses" element={<Course />} />
      </Route>
    </Routes>
  );
}

function App() {
  const [msg, setMsg] = useState("");
  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api");
      setMsg(response.data.message);
      console.log(response);
    } catch (error) {
      console.error("API fetch error:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
