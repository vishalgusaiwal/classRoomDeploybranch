import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/api-helper';
import { complete, read } from './api-enrollment';
import { Grid, Paper, Typography } from '@mui/material';
import { Info, CheckCircle, RadioButtonChecked as RadioButtonUncheckedIcon, AccessTimeFilled } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
const base_url = import.meta.env.VITE_API_BASE_URL;
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
        display: 'flex',
        justifyContent:'space-around'
    },
    tileTitle: {
        color: theme.palette.common.white,
        textDecoration: 'none',
        justifySelf: 'flex-end',
        marginRight:'0px'
    },
    action: {
        marginTop: theme.spacing(5),
    },
}));

export default function Enrollments(props) {
    const classes = useStyles();
    return (
        <div>
            {/*<Grid container className={classes.root}>
                <Grid item xs={12}>
                    <Grid container className={classes.demo} justify="center" spacing={16}>
                        {props.enrollments.map((course, i) => (
                            <Grid className={classes.tile}>
                                <Link to={"learn/" + course._id}><img className={classes.image} src={base_url+'/api/courses/photo/' + course.course._id} alt={course.course.name} /></Link>
                                <Grid className={classes.tileBar} title={<Link to={"learn/" + course._id} className={classes.tileTitle}></Link>} actionIcon={<div className={classes.action}>
                                    {course.completed ? (<CompletedIcon color="secondary" />) : (<AccessTimeFilled className={classes.progress}/>)}
                                </div>}/>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>*/}
            <Grid container spacing={2}>
                {props.enrollments.map((enrollment, i) => {
                    return (
                        <>
                            <Grid item key={i} xs={6} sm={6} md={6}>
                                <Paper elevation={3} className={classes.tile}>
                                    <Link to={"/learn/" + enrollment._id}><img className={classes.image} src={base_url + '/course/api/courses/photo/' + enrollment.course._id} alt={enrollment.course.name} /></Link>
                                    <div className={classes.tileBar}>
                                        <Typography variant="h6" className={classes.tileTitle}>
                                            <Link to={"/course/" + enrollment.course._id} style={{ textDecoration: 'none', color: 'black' }}>{enrollment.course.name}</Link>
                                        </Typography>
                                        <Typography variant="subtitle1" className={classes.tileTitle}>{enrollment.course.category}</Typography>
                                    </div>
                                </Paper>
                            </Grid>
                        </>
                    )
                })}
            </Grid>
        </div>
    );
}