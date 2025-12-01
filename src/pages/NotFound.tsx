import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          The page you are looking for doesn't exist.
        </Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;