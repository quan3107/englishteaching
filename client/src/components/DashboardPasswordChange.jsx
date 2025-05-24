import React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import "./styles/DashboardProfile.css";

function DashboardPasswordChange({onCancel, onSuccess}) {
    
    const [password, setPassword] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    
    function handleChange(event) {
      const {name, value} = event.target;
      setPassword((prevPassword) => ({
        ...prevPassword,
        [name]: value,
      }));
    }

    function handleSavePassword(event) {
      console.log(password);
      event.preventDefault();
      onSuccess();
    }    
    
    return (
      <div
        id="passwordChange"
        className="password-change"
      >
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
              onChange={handleChange}
            />
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              required
              placeholder="New Password"
              onChange={handleChange}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              required
              placeholder="Confirm Password"
              onChange={handleChange}
            />
          </div>
        </form>
        <div
          id="passwordActions"
          className="password-actions"
          
        >
          <button className="action-btn primary" onClick={handleSavePassword}>
            Save Password
          </button>
          <button className="action-btn secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
}

export default DashboardPasswordChange;
