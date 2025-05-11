import React from "react";
import "../App.css";
import Navbar from "../components/Navbar";
import { Container, Typography, Paper } from "@mui/material";
import Footer from "../components/Footer";
import Course from "../components/Course";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  return (
    <div className="app-container">
      <Navbar />
      <Container
        maxWidth={false}
        disableGutters
        sx={{ flexGrow: 1, mt: 4, mb: 4 }}
      >
        <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 0 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Nhi Chau English 
          </Typography>
          <Typography variant="body1" paragraph>
            Explore our courses and resources to enhance your learning journey!
          </Typography>
        </Paper>
      </Container>
      <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 0 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Secondary School Courses
        </Typography>

        <Container
          maxWidth={false}
          disableGutters
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
            mt: 4,
            mb: 4,
            px: 3,
          }}
        >
          <Course
            title="6th Grade"
            description="English Fundamentals for 6th Graders"
          />
          <Course
            title="7th Grade"
            description="English Fundamentals for 7th Graders"
          />
          <Course
            title="8th Grade"
            description="English Fundamentals for 8th Graders"
          />
          <Course
            title="9th Grade"
            description="English Fundamentals for 9th Graders"
          />
          <Course
            title="10th Grade"
            description="English Fundamentals for 10th Graders"
          />
        </Container>
      </Paper>
      <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 0 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          IELTS Courses
        </Typography>

        <Container
          maxWidth={false}
          disableGutters
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
            mt: 4,
            mb: 4,
            px: 3,
          }}
        >
          <Course
            title="IELTS Speaking"
            description="IELTS Speaking Fundamentals"
          />
          <Course
            title="IELTS Reading"
            description="IELTS Reading Fundamentals"
          />
          <Course
            title="IELTS Listening"
            description="IELTS Listening Fundamentals"
          />
          <Course
            title="IELTS Writing"
            description="IELTS Writing Fundamentals"
          />
        </Container>
      </Paper>

      <Footer />
    </div>
  );
}

export default Home;