import React from 'react';
import { useEffect, useState } from "react";
import { makeStyles } from '@mui/styles';
import { list } from './api-user';
import { Link } from 'react-router-dom';
import { Person, ArrowForward } from '@mui/icons-material';
import { Button, AppBar, Toolbar, IconButton, Card, CardContent, CardMedia, Typography, Grid, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction } from '@mui/material';
const useStyles = makeStyles(theme => ({
    card: {
        margin: 'auto',
        marginTop: theme.spacing(5)
    },
    media: {
        minHeight: 400
    },
    root: {
        padding: theme.spacing(1),
        margin: theme.spacing(5),
        marginTop: theme.spacing(40),
    },
    title: {
        margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    }
}));
export default function Users() {
    const [users, setUsers] = useState([]);
    const classes = useStyles();
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        list(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setUsers(data.users);
            }
        });
        return function cleanup() {
            abortController.abort();
        }
    }, []);

    return (
        <Paper className={classes.root} elevation={4}>
            <Typography variant="h6" className={classes.title}>
                All users
            </Typography>
            <List dense>
                {users && users.map((item, i) => {
                    return (
                        <Link to={"/user/" + item._id} key={i} style={{ textDecoration: 'none', color: 'black' }}>
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar src={`/api/users/photo/${item._id}?${new Date().getTime}`}>
                                        <Person />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={item.name} />
                                <ListItemSecondaryAction>
                                    <IconButton>
                                        <ArrowForward />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Link>
                    )
                })}
            </List>
        </Paper>
    );
}