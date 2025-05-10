import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Button } from '@mui/material';

function Course({ title = "6th Grade", description = "English Fundamentals for 6th Graders" }) {
  return (
    <Card sx={{
      width: { xs: '100%', sm: '45%', md: '30%', lg: '22%' },
      minWidth: 280,
      maxWidth: 345,
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardActionArea sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="140"
          image="https://nhasachphuongnam.com/images/detailed/284/tieng-anh-lop-6-tap-1-global-success-sach-bai-tap.jpg"
          alt={`English for ${title}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {description}
          </Typography>
          <Button variant="contained" color="primary" fullWidth>
            View Course
          </Button>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default Course;

