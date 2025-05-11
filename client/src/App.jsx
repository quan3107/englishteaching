import './App.css'
import Navbar from './components/Navbar'
import { Container, Typography, Paper } from '@mui/material'
import Footer from './components/Footer'
import Course from './components/Course'
import { useEffect, useState } from 'react'
import axios from "axios";
import {BrowserRouter as Router, Routes, Route} from "react-router";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup'


function App() {
  const [msg, setMsg] = useState("");
  const fetchAPI = async () => {
    const response = await axios.get("http://localhost:3000/api");
    setMsg(response.data.message);
    console.log(response);
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App
