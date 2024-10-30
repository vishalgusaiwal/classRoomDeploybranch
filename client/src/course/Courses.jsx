import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/api-helper';
const base_url = import.meta.env.VITE_API_BASE_URL;
import PropTypes from 'prop-types';
import { Grid, Paper, Typography } from '@mui/material';
import Enroll from '../enrollment/Enroll';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    gridList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        padding: theme.spacing(10),
    },
    tile: {
        margin: theme.spacing(5),
        position: 'relative',
        cursor: 'pointer',
    },
    image: {
        width: '100%',
        height: '200px',
        display: 'block',
    },
    tileBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        padding: theme.spacing(5),
        display:'flex'
    },
    tileTitle: {
        color: theme.palette.common.white,
        textDecoration: 'none',
    },
    action: {
        marginTop: theme.spacing(5),
    },
}));


export default function Courses(props) {
    const classes = useStyles();
    const findCommon = (course) => {
        return !props.common.find((enrolled) => { return enrolled.course._id == course._id });
    }
    return (
        <>
            <Grid container spacing={2}>
                {props.courses.map((course, i) => {
                    return (
                        <>
                            {
                                findCommon(course) && <Grid item key={i} xs={6} sm={6} md={6}>
                                    <Paper elevation={3} className={classes.tile}>
                                        <Link to={"/course/" + course._id}><img className={classes.image} src={base_url + '/course/api/courses/photo/' + course._id} alt={course.name} /></Link>
                                        <div className={classes.tileBar}>
                                            <Typography variant="h6" className={classes.tileTitle} style={{ textDecoration: 'none', color: 'white' }}>
                                                <Link to={"/course/" + course._id}>{course.name}</Link>
                                            </Typography>
                                            <Typography variant="subtitle1" className={classes.tileTitle}>{course.category}</Typography>
                                            <div className={classes.action}>
                                                {isAuthenticated() ? <Enroll courseId={course._id} /> : <Link to="/signin">Sign in to Enroll</Link>}
                                            </div>
                                        </div>
                                    </Paper>
                                </Grid>
                            }
                        </>
                    )
                })}
            </Grid>
        </>
    )
}

Courses.propTypes = {
    courses: PropTypes.array.isRequired
}