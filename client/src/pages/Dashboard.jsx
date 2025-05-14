import React from "react";
import "./login.css";
import DashboardNavbar from "../components/DashboardNavbar";
import { Typography, Container, Paper } from "@mui/material";

function Dashboard() {
    return (
        <div className="dashboard-page">
            <DashboardNavbar />
            <Container
                maxWidth={false}
                sx={{
                    padding: '20px',
                    marginTop: '20px',
                    marginLeft: { xs: '0', md: '260px' },
                    width: { xs: '100%', md: 'calc(100% - 260px)' },
                    transition: 'all 0.3s ease'
                }}
            >
                <Paper elevation={3} sx={{ padding: '20px' }}>
                    <Typography variant="h3" gutterBottom>
                        Dashboard Overview
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Welcome to your dashboard! Here you can manage your courses, assignments, and profile.
                    </Typography>
                </Paper>
            </Container>
        </div>
    );
}

export default Dashboard;