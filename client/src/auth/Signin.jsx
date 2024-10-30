import { Card, CardContent, Typography, TextField, Button, CardActions, Icon } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signin } from './api-auth';
import { authenticate } from './api-helper';
import { makeStyles } from '@mui/styles';
//192.168.1.24

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

const Signin = (props) => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        redirectToReferrer: false
    });
    const navigate = useNavigate();
    const classes = useStyles();
    const clickSubmit = () => {
        const user = {
            email: values.email || undefined,
            password: values.password || undefined
        }
        signin(user).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                authenticate(data, () => {
                    setValues({ ...values, error: '', redirectToReferrer: true });
                });
            }
        });
    }
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    }
    const { from } = props.location || { from: { pathname: "/" } };
    const { redirectToReferrer } = values;
    if (redirectToReferrer) navigate(from);// redirect(from);
    return (
        <>
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h6" className={classes.title}>
                        Sign in
                    </Typography>
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
                            <Icon color="error" className={classes.error}>Error</Icon>
                            {values.error}
                        </Typography>)
                    }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="contained"
                        onClick={clickSubmit} className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
        </>
    )
}

export default Signin;