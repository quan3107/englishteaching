import './App.css'
import Navbar from './components/Navbar'
import { Container, Typography, Paper } from '@mui/material'
import Footer from './components/Footer'

function App() {

  return (
    <div className="app-container">
      <Navbar />
      <Container maxWidth={false} disableGutters sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 0 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Nhi Chau
          </Typography>
          <Typography variant="body1" paragraph>
            Explore our courses and resources to enhance your learning journey!
          </Typography>
        </Paper>
      </Container>
      <Footer />
    </div>
  )
}

export default App
