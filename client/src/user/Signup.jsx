import { create } from './api-user';
import React from 'react';
import { useEffect, useState } from "react";
import { makeStyles } from '@mui/styles';
import unicornbikeImg from './../assets/images/unicornbike.jpg';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Icon, CardActions, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(40),
        paddingBottom: theme.spacing(2)
    },
    error: {
        verticalAlign: 'middle'
    },
    title: {
        marginTop: theme.spacing(2),
        color: theme.palette.openTitle
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
    }
}));
export default function Signup() {
    const [values, setValues] = useState({
        name: '',
        password: '',
        email: '',
        open: false,
        error: ''
    });
    const classes = useStyles();
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    }
    const clickSubmit = () => {
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined
        }
        create(user).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, error: '', open: true });
            }
        });
    }

    return (
        <>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Sign up
                    </Typography>
                    <TextField id="name" lable="Name"
                        className={classes.textField}
                        value={values.name} onChange={handleChange('name')}
                        margin="normal"
                    />
                    <br />
                    <TextField id="email" lable="Email"
                        className={classes.textField}
                        value={values.email} onChange={handleChange('email')}
                        margin="normal"
                    />
                    <br />
                    <TextField id="password" lable="Password"
                        className={classes.textField}
                        value={values.password} onChange={handleChange('password')}
                        margin="normal"
                    />
                    <br />
                    {
                        values.error && (<Typography component="p" color="error">
                            <Icon color="error"
                                className={classes.error}>Error</Icon>
                            {values.error}
                        </Typography>)
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained"
                        onClick={clickSubmit}
                        className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
            <Dialog open={values.open} disableBackdropClick={true}>
                <DialogTitle>New Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        New account created successfully.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Link to="/signin">
                        <Button color="primary" autoFocus="autoFocus"
                            variant="contained">
                            Sign in
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </>
    )
}