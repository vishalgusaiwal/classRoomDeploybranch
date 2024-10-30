import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { isAuthenticated } from './../auth/api-helper';
import { read } from "./api-user";
import { Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Divider } from '@mui/material';
import { Edit, Person } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import DeleteUser from "./DeleteUser";


const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginTop: theme.spacing(5)
    },
    media: {
        minHeight: 400
    },
    root: {
        margin: 'auto',
        padding: theme.spacing(3),
        marginTop: theme.spacing(40)
    },
    title: {
        marginTop: theme.spacing(3),
        color: theme.palette.protectedTitle
    }
}));
const Profile = ()=>{
    const [user, setUser] = useState({});
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const classes = useStyles();
    const params = useParams();
    const navigate = useNavigate();
    console.log(params);
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const jwt = isAuthenticated();
        read({
            userId: params.userId
        }, { t: jwt.token }, signal).then((data) => {
            if (data && data.error) {
                setRedirectToSignin(true);
            } else {
                setUser(data.profile);
            }
        });
        return () => {
            abortController.abort();
        }
    }, [params.userId]);
    if (redirectToSignin) navigate('/signin');
    
    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                Profile
            </Typography>
            <List dense>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <Person />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.name} secondary={user.email} />
                    {
                        isAuthenticated().user && isAuthenticated().user._id == user._id && (
                            <ListItemSecondaryAction>
                                <Link to={"/user/edit/" + user._id}>
                                    <IconButton aria-label="Edit" color="primary">
                                        <Edit />
                                    </IconButton>
                                </Link>
                                <DeleteUser userId={user._id}/>
                            </ListItemSecondaryAction>
                        )
                    }
                </ListItem>
                <Divider />
                <ListItem>
                    <ListItemText primary={"Joined: " + (
                        new Date(user.created)).toDateString()} />
                </ListItem>
            </List>
        </Paper>
    );
}

export default Profile;