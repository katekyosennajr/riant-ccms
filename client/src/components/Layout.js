// Layout component yang akan digunakan di seluruh aplikasi
import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'white', flexGrow: 1 }}>
            Riant CMS
          </Typography>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '2rem' }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;