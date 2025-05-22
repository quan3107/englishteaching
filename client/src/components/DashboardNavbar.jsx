import React, {useState} from "react";
import { Link, NavLink } from "react-router-dom";
import {useAuth} from "../Routes/Auth";
import "./styles/dashboard-navbar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardOverview from "./DashboardOverview"; // Import DashboardOverview
import { Children } from "react";
import { Outlet } from "react-router-dom";

function DashboardNavbar() {
    const [sideBarOpen, setSideBar] = useState(false);
    const {user, logout} = useAuth();
    console.log(user);

    const navigate = useNavigate();

    function toggleSideBar() {
        setSideBarOpen(!sideBarOpen);
    }

    async function handleLogout() {
        try {
          const res = await axios.post("http://localhost:3000/api/logout", {}, 
            {withCredentials: true}
          );
          console.log(res.data.message);
          logout();
          navigate("/");
          
        } catch (err) {
          console.log(err);
        }
    }

    const firstName = user?.name?.split(' ')[0] || "Student";

    function getInitials() {
        const stuName = user.firstname + " " + user.lastname;
        console.log(stuName);
        if (!stuName) return "U";
        const names = stuName.split(" ");
        console.log(names);
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        const start = ""
        const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");
        console.log(initials);
        // return (names[0].charAt(0) + names[names.length-1].charAt(0)).toUpperCase();
        return initials;
    }

    return (
      <div className="dashboard-layout">
        {/*sidebar for navigation*/}
        <aside className={`dashboard-sidebar ${sideBarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h2 className="sidebar-logo">NCE Dashboard</h2>
            <button className="sidebar-close" onClick={toggleSideBar}>
              <span className="close-icon">×</span>
            </button>
          </div>

          <div className="sidebar-user">
            <div className="user-avatar">{getInitials()}</div>
            <div className="user-info">
              <h3 className="user-name">{user?.lastname || "Student"}</h3>
              <p className="user-email">{user?.email || "Student@nce.com"}</p>
            </div>
          </div>

          <nav className="sidebar-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink to="/dashboard/overview" className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}>
                  <svg className="nav-icon" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
                  </svg>
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dashboard/courses" className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}>
                  <svg className="nav-icon" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"></path>
                  </svg>
                  My Courses
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dashboard/assignments" className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}>
                  <svg className="nav-icon" viewBox="0 0 24 24">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path>
                  </svg>
                  Assignments
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dashboard/grades" className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}>
                  <svg className="nav-icon" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.11-.9 2-2 2h-2v2h4v2H9v-4c0-1.11.9-2 2-2h2V9H9V7h4c1.1 0 2 .89 2 2v2z"></path>
                  </svg>
                  Grades
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/dashboard/profile" className={({isActive}) => (isActive ? "nav-link active" : "nav-link")}>
                  <svg className="nav-icon" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                  </svg>
                  Profile
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-button">
              <svg className="logout-icon" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
              </svg>
              Logout
            </button>
          </div>
        </aside>
        {/* Top navbar */}
        <div className="dashboard-main">
          <header className="dashboard-header">
            <button className="menu-toggle" onClick={toggleSideBar}>
              <span className="toggle-bar"></span>
              <span className="toggle-bar"></span>
              <span className="toggle-bar"></span>
            </button>

            <div className="header-title">
              <h1 className="caveat-h1">Warmly welcome to NCE, {user.lastname}</h1>
            </div>

            <div className="header-actions">
              <div className="notification-bell">
                <svg className="bell-icon" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
                </svg>
                <span className="notification-badge">
                    {/*this needs to be a dynamic variable*/}
                    1
                </span>
              </div>

              <div className="user-dropdown">
                <button className="dropdown-toggle">
                  <div className="user-avatar small">{getInitials()}</div>
                  <span className="user-name">{firstName}</span>
                  <svg className="dropdown-arrow" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"></path>
                  </svg>
                </button>

                <div className="dropdown-menu">
                  <Link to="/dashboard/profile" className="dropdown-item">
                    My Profile
                  </Link>
                  <Link to="/dashboard/settings" className="dropdown-item">
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard content will go here */}
          <main className="dashboard-content">
            {/* This is where dashboard content will be rendered */}
            <Outlet />
          </main>
        </div>
      </div>
    );
}

export default DashboardNavbar;