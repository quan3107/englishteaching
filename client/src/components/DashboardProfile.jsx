import React from "react";
import "./styles/DashboardProfile.css";
import { useAuth } from '../Routes/Auth'; 
import { useEffect } from "react";
import axios from "axios";

function DashboardProfile() {
  const {user} = useAuth();
  const [editState, setEditState] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/dashboard/profile",
          {withCredentials: true}
        );
        console.log(res.data);
        setUserInfo(res.data);


      } catch (err) {
        console.log(err);
      }
    }
    fetchUserInfo();
  }, [])


  const placeholderUser = {
    fullName: "John Doe",
    username: "johndoe99",
    email: "john.doe@example.com",
    
    profileImageUrl: "https://via.placeholder.com/150/3498db/ffffff?Text=JD", // Placeholder image with initials
    joinDate: "Joined January 1, 2023",
    
  };

  function toggleEdit(field) {
    setEditState(!editState);
    const display = document.getElementById(field + "Display");
    const input = document.getElementById(field + "Input");
    const editBtn = document.getElementById(field + "Btn");
    if (editState) {
      display.style.display = "inline";
      input.style.display = "none";
      editBtn.innerText = "Edit";
    } else {
      display.style.display = "none";
      input.style.display = "inline";
      editBtn.innerText = "Done";
      input.focus();
    }
  }

  return (
    <div className="dashboard-profile">
      
      <div className="profile-container">
        <h2>My Profile</h2>
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={placeholderUser.profileImageUrl} alt="Profile" />
            <button
              className="edit-avatar-btn"
              aria-label="Change profile picture"
            >
              {/* Icon placeholder, you can use an SVG or icon font here */}
              &#x270E;{/* Pencil icon */}
            </button>
          </div>
          <div className="profile-summary">
            <h3>{placeholderUser.fullName}</h3>
            <p>@{placeholderUser.username}</p>
            <p className="join-date">{placeholderUser.joinDate}</p>
            {/* Example for new field from useAuth() */}
            {/* {placeholderUser.studentId && <p className="student-id">Student ID: {placeholderUser.studentId}</p>} */}
            {/* {placeholderUser.program && <p className="program">Program: {placeholderUser.program}</p>} */}
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <label htmlFor="fullNameInput">Full Name</label>
            <div className="value-edit">
              {/* In a real app, this would be an input field when editing */}
              <span id="fullNameDisplay">{placeholderUser.fullName}</span>
              <input type="text" id="fullNameInput" style={{display: "none"}} />
              <button
                id="fullNameBtn"
                type="button"
                className="edit-btn"
                aria-label="Edit Full Name"
                onClick={() => {
                  // Logic to toggle input field for editing
                  // const display = document.getElementById("fullNameDisplay");
                  // const input = document.getElementById("fullNameInput");
                  // if (display.style.display === "none") {
                  //   display.style.display = "inline";
                  //   input.style.display = "none";
                  //   document.getElementById("fullNameBtn").innerText = "Edit";
                  // } else {
                  //   display.style.display = "none";
                  //   input.style.display = "inline";
                  //   document.getElementById("fullNameBtn").innerText = "Done";
                  //   input.focus();
                  // }
                  toggleEdit("fullName");
                }}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="detail-item">
            <label htmlFor="emailInput">Email Address</label>
            <div className="value-edit">
              <span id="emailDisplay">{placeholderUser.email}</span>
              <button
                className="edit-btn"
                aria-label="Edit Email Address"
              >
                Edit
              </button>
            </div>
          </div>
          <div className="detail-item">
            <label htmlFor="usernameInput">Username</label>
            <div className="value-edit">
              <span id="usernameDisplay">{placeholderUser.username}</span>
              <button
                className="edit-btn"
                aria-label="Edit Username"
              >
                Edit
              </button>
            </div>
          </div>
          {/* Bio section removed */}
          {/* Example for new editable field */}
          {/* {placeholderUser.program && 
              <div className="detail-item">
                  <label htmlFor="programInput">Program</label>
                  <div className="value-edit">
                      <span id="programDisplay">{placeholderUser.program}</span>
                      <button className="edit-btn" aria-label="Edit Program">Edit</button>
                  </div>
              </div>
          } */}
        </div>

        <div className="profile-actions">
          <button className="action-btn primary">Save Changes</button>
          <button className="action-btn secondary">Change Password</button>
        </div>
      </div>
    </div>
  );
}

export default DashboardProfile;