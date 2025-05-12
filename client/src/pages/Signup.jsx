import React from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router";

function Signup() {
  const navigate = useNavigate();
  const [userInfo, setUser] = React.useState({
    email: "",
    password: ""
  });

  function handleChange(e) {
    const {name, value} = e.target;
    setUser((prevState) => {
      return {
        ...prevState,
        [name]: value

      }
    })
  }

  async function handleClick(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/signup", 
        {
          username: userInfo.email,
          password: userInfo.password
        },
        {withCredentials: true}
      );
      
      console.log(res.data.message);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="user-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <h2>Welcome to NCE</h2>
        </div>

        <form className="login-form" action="#" method="POST">
          <div className="form-group">
            <div className="email-header">
                <label htmlFor="email">Email address</label>
            </div>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              placeholder="your@email.com"
              onChange={handleChange}
              value={userInfo.email}
            />
          </div>

          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password">Password</label>
              
            </div>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              onChange={handleChange}
              value={userInfo.password}
            />
          </div>

          
          <button onClick={handleClick} type="submit" className="signin-button">
            Sign up
          </button>
        </form>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-login">
          <a href="#" className="social-button google">
            <svg fill="#4285F4" viewBox="0 0 24 24">
              <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.426-11.748l-9.426 0.082z"></path>
            </svg>
            Google
          </a>
          <a href="#" className="social-button facebook">
            <svg fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.738-.9 10.126-5.864 10.126-11.854z"></path>
            </svg>
            Facebook
          </a>
        </div>

        <p className="signup-link">
          Already a member?{" "}
          <a href="#">Sign in here</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;