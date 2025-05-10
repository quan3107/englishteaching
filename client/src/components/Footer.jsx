import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Nhi Chau Education
            </Typography>
            <Typography variant="body2">
              Providing quality English education 
              to help students achieve their goals.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link href="/about" color="inherit" display="block" sx={{ mb: 1 }}>
              About Us
            </Link>
            <Link href="/courses" color="inherit" display="block" sx={{ mb: 1 }}>
              Courses
            </Link>
            <Link href="/contact" color="inherit" display="block">
              Contact
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" paragraph>
              Email: nhichaunt5@gmail.com
            </Typography>
            <Typography variant="body2" paragraph>
              Phone: +84 903572972
            </Typography>
            <Typography variant="body2">
              Address: 11/15 Dong Da, Da Nang, Vietnam
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        
        <Typography variant="body2" align="center" sx={{ pt: 2 }}>
          © {new Date().getFullYear()} Nhi Chau Education. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;