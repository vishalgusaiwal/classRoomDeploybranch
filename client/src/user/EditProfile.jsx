import { isAuthenticated, updateUser } from './../auth/api-helper';
import { update, read } from './api-user';
import { Link, redirect, useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {Card , CardContent, Typography,FormControlLabel,Switch,TextField,Icon,CardActions,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions,Button} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        marginTop: theme.spacing(5)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 400
    }
}));
const EditProfile = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        redirectToProfile: false,
        educator: false
    });
    const [redirectToSignin, setRedirectToSignin] = useState(false);
    const classes = useStyles();
    const params = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const jwt = isAuthenticated();
        read({
            userId: params.userId
        }, { t: jwt.token }, signal).then((data) => {
            if (data && data.error) {
                setRedirectToSignin(true);
                //setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, name: data.profile.name, email: data.profile.email, educator: data.profile.educator });
            }
        });
        return () => {
            abortController.abort();
        }
    }, [params.userId]);
    const handleCheck = (event, checked) => {
        setValues({ ...values, 'educator': checked });
    }
    const clickSubmit = () => {
        const jwt = isAuthenticated();
        const user = {
            name: values.name || undefined,
            email: values.email || undefined,
            password: values.password || undefined,
            educator: values.educator || undefined
        }
        update({
            userId:params.userId
        }, {
            t: jwt.token
        }, user).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error });
            } else {
                updateUser(data.user, () => {
                    setValues({ ...values, userId: data._id, redirectToProfile: true });
                });
            }
        })
    }

    if (values.redirectToProfile) navigate('/user/' + params.userId);

    if (redirectToSignin) navigate('/signin');

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    }
    return (
        <>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Edit Your details
                    </Typography>
                    <Typography variant="subtitle1" className={classes.subheading}>I am an educator</Typography>
                    <FormControlLabel control={
                            <Switch classes={{
                                checked: classes.checked,
                                bar: classes.bar,
                            }}
                            checked={values.educator}
                            onChange={handleCheck} />
                        }
                        label={values.educator ? "Yes" : "No"}
                    />
                    <br/>
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
    );
}

export default EditProfile;