import React from "react";
import "./styles/DashboardProfile.css";
import { useAuth } from "../Routes/Auth";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function DashboardProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = React.useState({});
  const [changedInfo, setChangedInfo] = React.useState({});
  const [editNameState, setEditNameState] = React.useState(false);
  const [editEmailState, setEditEmailState] = React.useState(false);
  const [editAddressState, setEditAddressState] = React.useState(false);
  const [editTelState, setEditTelState] = React.useState(false);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/dashboard/profile",
          { withCredentials: true }
        );
        console.log(res.data);
        setUserInfo(res.data);
        setChangedInfo(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserInfo();
  }, []);

  const placeholderUser = {
    fullName: "John Doe",
    username: "johndoe99",
    email: "john.doe@example.com",

    profileImageUrl: "https://via.placeholder.com/150/3498db/ffffff?Text=JD", // Placeholder image with initials
    joinDate: "Joined January 1, 2023",
  };

  function handleChange(event) {
    const { value, name } = event.target;
    console.log(userInfo);
    if (name === "fullName") {
      const names = value.split(" ");
      console.log(names);
      const firstName = names.shift();
      const lastName = names.join(" ");
      console.log(firstName);
      console.log(lastName);
      setUserInfo((prevState) => {
        return {
          ...prevState,
          firstname: firstName,
          lastname: lastName,
        };
      });
    } else {
      setUserInfo((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    }
  }

  async function handleSave(event) {
    try {
      const res = await axios.put("http://localhost:3000/api/dashboard/profile", 
        {userInfo},
        { withCredentials: true }
      );
      console.log(res.data);
      navigate("/dashboard/profile");
    } catch (err) {
      console.log(err);
    }
  }

  function toggleEdit(field) {
    let editState;
    switch (field) {
      case "fullName":
        editState = editNameState;
        setEditNameState(!editNameState);
        break;
      case "email":
        editState = editEmailState;
        setEditEmailState(!editEmailState);
        break;
      case "address":
        editState = editAddressState;
        setEditAddressState(!editAddressState);
        break;
      case "tel":
        editState = editTelState;
        setEditTelState(!editTelState);
        break;
      default:
        break;
    }
    const display = document.getElementById(field + "Display");
    const input = document.getElementById(field + "Input");
    const editBtn = document.getElementById(field + "Btn");
    if (editState) {
      console.log(userInfo);
      display.style.display = "inline";
      input.style.display = "none";
      editBtn.innerText = "Edit";
      // if (input.value != "") {
      //   display.innerText = input.value;
      // }
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
          <div className="password-change" style={{display: "none"}}>
            <h3>Change Password</h3>
            <form className="password-form" action="#" method="POST">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  required
                  placeholder="Current Password"
                />
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  required
                  placeholder="New Password"
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  placeholder="Confirm Password"
                />
              </div>
            </form>
          </div>
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
              <span id="fullNameDisplay">
                {userInfo.firstname + " " + userInfo.lastname}
              </span>
              <input
                type="text"
                id="fullNameInput"
                name="fullName"
                onChange={handleChange}
                style={{ display: "none" }}
              />
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
              <span id="emailDisplay">{userInfo.email}</span>
              <input
                type="email"
                id="emailInput"
                name="email"
                onChange={handleChange}
                style={{ display: "none" }}
              />
              <button
                id="emailBtn"
                type="button"
                className="edit-btn"
                aria-label="Edit Email Address"
                onClick={() => {
                  // Logic to toggle input field for editing
                  toggleEdit("email");
                }}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="detail-item">
            <label htmlFor="addressInput">Address</label>
            <div className="value-edit">
              <span id="addressDisplay">{userInfo.address}</span>
              <input
                type="text"
                id="addressInput"
                name="address"
                onChange={handleChange}
                style={{ display: "none" }}
              />
              <button
                id="addressBtn"
                type="button"
                className="edit-btn"
                aria-label="Edit Username"
                onClick={() => {
                  // Logic to toggle input field for editing
                  toggleEdit("address");
                }}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="detail-item">
            <label htmlFor="telInput">Phone Number</label>
            <div className="value-edit">
              <span id="telDisplay">{userInfo.tel}</span>
              <input
                type="text"
                id="telInput"
                name="tel"
                onChange={handleChange}
                style={{ display: "none" }}
                
              />
              <button
                id="telBtn"
                type="button"
                className="edit-btn"
                aria-label="Edit Phone Number"
                onClick={() => {
                  // Logic to toggle input field for editing
                  toggleEdit("tel");
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="action-btn primary" onClick={handleSave}>Save Changes</button>
          <button className="action-btn secondary">Change Password</button>
        </div>
      </div>
    </div>
  );
}

export default DashboardProfile;
