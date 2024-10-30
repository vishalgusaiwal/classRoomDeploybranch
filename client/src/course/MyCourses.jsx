import { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Paper, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Avatar, Icon, Button, Typography, Divider } from '@mui/material';
import { isAuthenticated } from './../auth/api-helper';
import { listByInstructor } from './api-course.js'
import { Link } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
const base_url = import.meta.env.VITE_API_BASE_URL;

const useStyles = makeStyles(theme => ({
    root: {
        margin: 'auto',
        padding: theme.spacing(8),
        marginTop: theme.spacing(40)
    },
    title: {
        margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(1)}px`,
        color: theme.palette.protectedTitle,
        fontSize: '1.2em'
    },
    addButton: {
        float: 'right'
    },
    leftIcon: {
        marginRight: "8px"
    },
    avatar: {
        borderRadius: 0,
        width: 65,
        height: 40
    },
    listText: {
        marginLeft: 16
    }
}))

export default function MyCourses() {
    const classes = useStyles()
    const [courses, setCourses] = useState([])
    const [redirectToSignin, setRedirectToSignin] = useState(false)
    const jwt = isAuthenticated()

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        listByInstructor({
            userId: jwt.user._id
        }, { t: jwt.token }, signal).then((data) => {
            if (data.error) {
                setRedirectToSignin(true)
            } else {
                setCourses(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [])

    if (redirectToSignin) navigate('/signin');
    return (
        <>
            <Paper className={classes.root} elevation={4}>
                <Typography type="title" className={classes.title}>
                    Your Courses
                    <span className={classes.addButton}>
                        <Link to="/teach/course/new">
                            <Button color="primary" variant="contained">
                                <Icon className={classes.leftIcon}><AddBoxIcon/></Icon>  New Course
                            </Button>
                        </Link>
                    </span>
                </Typography>
                <List dense>
                    {courses.map((course, i) => {
                        return <Link to={"/teach/course/" + course._id} key={i} style={{ textDecoration: 'none' }}>
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar src={base_url+'/course/api/courses/photo/' + course._id + "?" + new Date().getTime()} className={classes.avatar} />
                                </ListItemAvatar>
                                <ListItemText primary={course.name} secondary={course.description} className={classes.listText} />
                            </ListItem>
                            <Divider />
                        </Link>
                    })}
                </List>
            </Paper>
        </>)
}