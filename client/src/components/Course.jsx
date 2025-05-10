import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

function Course() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="https://nhasachphuongnam.com/images/detailed/284/tieng-anh-lop-6-tap-1-global-success-sach-bai-tap.jpg"
          alt="English for 6th grader"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            6th Grade
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            English Fundamentals for 6th Graders
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Course;
  
