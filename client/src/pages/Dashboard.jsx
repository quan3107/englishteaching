import React from "react";
import "./login.css";
import DashboardNavbar from "../components/DashboardNavbar";
import { Typography, Container, Paper } from "@mui/material";
import { useAuth } from "../Routes/Auth";
import DashboardOverview from "../components/DashboardOverview"; 
function Dashboard() {
    const { user } = useAuth();
    return (
        <div className="dashboard-page">
            <DashboardNavbar >
                <DashboardOverview />
            </DashboardNavbar>
            
        </div>
    );
}

export default Dashboard;