import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import unicornbikeImg from './../assets/images/unicornbike.jpg';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/api-helper';
/*import FindPeople from '../user/FindPeople';
import Newsfeed from '../post/Newsfeed';*/
import { Button, AppBar, Toolbar, IconButton, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import { listPublished } from '../course/api-course';
import Courses from '../course/Courses';
import { listEnrollments } from '../enrollment/api-enrollment';
import Enrollments from '../enrollment/Enrollments';

const useStyles = makeStyles(theme => ({
    card: {
        width: '90%',
        margin: 'auto',
        marginTop: 10,
        marginBottom: theme.spacing(1),
        padding: 10,
        backgroundColor: '#ffffff'
    },
    extraTop: {
        marginTop: theme.spacing(40)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 400
    },
    gridList: {
        width: '100%',
        minHeight: 200,
        padding: '10px 0 6px'
    },
    tile: {
        textAlign: 'center'
    },
    image: {
        height: '100%'
    },
    tileBar: {
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        textAlign: 'left'
    },
    enrolledTitle: {
        color: '#efefef',
        marginBottom: 2
    },
    action: {
        margin: '0 10px'
    },
    enrolledCard: {
        backgroundColor: '#616161',
    },
    divider: {
        marginBottom: 16,
        backgroundColor: 'rgb(157, 157, 157)'
    },
    noTitle: {
        color: 'lightgrey',
        marginBottom: 6,
        marginLeft: 4
    }
}));

export default function Home() {
    const classes = useStyles();
    const [defaultPage, setDefaultPage] = useState(false);
    const [courses, setCourses] = useState([]);
    const [enrolled, setEnrolled] = useState([]);
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        listPublished(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setCourses(data);
            }
        });
    }, []);
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const jwt = isAuthenticated();
        listEnrollments({ t: jwt.token }, signal).then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setEnrolled(data);
            }
        });
    }, []);
    return (
        <div className={classes.extraTop}>
            {
                isAuthenticated().user && (
                    <Card className={`${classes.card} ${classes.enrolledCard}`}>
                        <Typography variant="h6" component="h2" className={classes.enrolledTitle}>
                            Courses you are enrolled in
                        </Typography>
                        {
                            enrolled.length != 0 ? (<Enrollments enrollments={enrolled} />):(<Typography variant="body1" className={classes.noTitle}>No courses</Typography>)
                        }
                    </Card>
                )
            }
            <Card className={classes.card}>
                <Typography variant="h6" className={classes.title}>
                    Welcome to ClassRoom
                </Typography>
                <Card className={classes.card}>
                    <Typography variant="h5" component="h2">
                        All Courses
                    </Typography>
                    {(courses && courses.length != 0 && courses.length != enrolled.length) ? <Courses courses={courses} common={enrolled} /> : (<Typography variant="body1" className={classes.noTitle}>No new courses.</Typography>)}
                </Card>
            </Card>
        </div>
    );
}