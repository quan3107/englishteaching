import './App.css'
import Navbar from './components/Navbar'
import { Container, Typography, Paper } from '@mui/material'
import Footer from './components/Footer'
import Course from './components/Course'

function App() {

  return (
    <div className="app-container">
      <Navbar />
      <Container maxWidth={false} disableGutters sx={{   flexGrow: 1, mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 0 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Nhi Chau English
          </Typography>
          <Typography variant="body1" paragraph>
            Explore our courses and resources to enhance your learning journey!
          </Typography>

        </Paper>

      </Container>
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
          px: 3
        }}
      >
        <Course title="6th Grade" description="English Fundamentals for 6th Graders" />
        <Course title="7th Grade" description="English Fundamentals for 7th Graders" />
        <Course title="8th Grade" description="English Fundamentals for 8th Graders" />
        <Course title="9th Grade" description="English Fundamentals for 9th Graders" />
        <Course title="10th Grade" description="English Fundamentals for 10th Graders" />
        <Course title="11th Grade" description="English Fundamentals for 11th Graders" />
      </Container>

      <Footer />
    </div>
  )
}

export default App
