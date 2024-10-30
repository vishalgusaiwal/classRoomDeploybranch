//import React from 'react';
import { Button, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Home as HomeIcon, LocalLibrary } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, clearJWT } from '../auth/api-helper';


export default function Menu() {
    const isActive = (location, path) => {
        if (location.pathname === path) return { color: '#ff4081' };
        else return { color: '#ffffff' };
    }
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <>
            <AppBar position="fixed" style={{ zIndex: 12343455 }}>
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        Social Media Application
                    </Typography>
                    <div>
                        <Link to="/">
                            <IconButton aria-label="Home" style={isActive(location, "/")}>
                                <HomeIcon />
                            </IconButton>
                        </Link>
                    </div>
                    <div style={{ 'position': 'absolute', 'right': '10px' }}><span style={{ 'float': 'right' }}>
                        <Link to="/users">
                            <Button style={isActive(location, "/users")}>Users</Button>
                        </Link>
                    {
                        !isAuthenticated() && (
                            <>
                                <Link to="/signup">
                                    <Button style={isActive(location, "/signup")}>Sign up</Button>
                                </Link>
                                <Link to="/signin">
                                    <Button style={isActive(location, "/signin")}>Sign in</Button>
                                </Link>
                            </>
                        )
                    }
                    {
                        isAuthenticated() && (
                            <>
                                {
                                    isAuthenticated().user.educator && (
                                        <Link to="/teach/courses">
                                            <Button style={isActive(location, "/teach/")}><LocalLibrary />Teach</Button>
                                        </Link>
                                    )
                                }
                                <Link to={"/user/" + isAuthenticated().user._id}>
                                    <Button style={isActive(location, "/user/" + isAuthenticated().user._id)}>
                                        My profile
                                    </Button>
                                </Link>
                                <Button color="inherit"
                                    onClick={() => { clearJWT(() => navigate('/signin')) }}>
                                    Sign out
                                </Button>
                            </>
                        )
                        }
                    </span></div>
                </Toolbar>
            </AppBar>
        </>
    );
}