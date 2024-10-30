import { useState, useEffect } from 'react';
import { CardHeader, Card, CardMedia, Typography, IconButton, Button, List, ListItem, ListItemAvatar, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle,Avatar } from '@mui/material';
import { Group, VerifiedUser, Edit } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { read, update } from './api-course.js';
import { enrollmentStats } from './../enrollment/api-enrollment';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isAuthenticated } from './../auth/api-helper';
import DeleteCourse from './DeleteCourse';
import NewLesson from './NewLesson';
import Enroll from '../enrollment/Enroll';
//import Enroll from './../enrollment/Enroll';
const base_url = import.meta.env.VITE_API_BASE_URL;

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 800,
        margin: 'auto',
        padding: theme.spacing(8),
        marginTop: theme.spacing(40)
    },
    flex: {
        display: 'flex',
        marginBottom: 20
    },
    card: {
        padding: '24px 40px 40px'
    },
    subheading: {
        margin: '10px',
        color: theme.palette.openTitle
    },
    details: {
        margin: '16px',
    },
    sub: {
        display: 'block',
        margin: '3px 0px 5px 0px',
        fontSize: '0.9em'
    },
    media: {
        height: 190,
        display: 'inline-block',
        width: '100%',
        marginLeft: '16px'
    },
    icon: {
        verticalAlign: 'sub'
    },
    category: {
        color: '#5c5c5c',
        fontSize: '0.9em',
        padding: '3px 5px',
        backgroundColor: '#dbdbdb',
        borderRadius: '0.2em',
        marginTop: 5
    },
    action: {
        margin: '10px 0px',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    statSpan: {
        margin: '7px 10px 0 10px',
        alignItems: 'center',
        color: '#616161',
        display: 'inline-flex',
        '& svg': {
            marginRight: 10,
            color: '#b6ab9a'
        }
    },
    enroll: {
        float: 'right'
    }
}))

export default function Course() {
    const classes = useStyles()
    const [stats, setStats] = useState({})
    const [course, setCourse] = useState({ instructor: {} })
    const [values, setValues] = useState({
        redirect: false,
        error: ''
    })
    const [open, setOpen] = useState(false)
    const jwt = isAuthenticated();
    const navigate = useNavigate();
    const params = useParams();
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        read({ courseId: params.courseId }, signal).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setCourse(data)
            }
        })
        return function cleanup() {
            abortController.abort()
        }
    }, [params.courseId])
    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        enrollmentStats({ courseId: params.courseId }, { t: jwt.token }, signal).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setStats(data)
            }
        });
        return function cleanup() {
            abortController.abort()
        }
    }, [params.courseId])
    const removeCourse = (course) => {
        setValues({ ...values, redirect: true })
    }
    const addLesson = (course) => {
        setCourse(course);
    }
    const clickPublish = () => {
        if (course.lessons.length > 0) {
            setOpen(true)
        }
    }
    const publish = () => {
        let courseData = new FormData()
        courseData.append('published', true)
        update({
            courseId: params.courseId
        }, {
            t: jwt.token
        }, courseData).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setCourse({ ...course, published: true })
                setOpen(false)
            }
        })
    }
    const handleClose = () => {
        setOpen(false)
    }
    if (values.redirect) navigate('/teach/courses');

    const imageUrl = course._id
        ? `${base_url}/course/api/courses/photo/${course._id}?${new Date().getTime()}`
        : '/api/courses/defaultphoto'
    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <CardHeader
                    title={course.name}
                    subheader={<div>
                        <Link to={"/user/" + course.instructor._id} className={classes.sub} style={{ textDecoration:'none' }}>By {course.instructor.name}</Link>
                        <span className={classes.category}>{course.category}</span>
                    </div>
                    }
                    action={<>
                        {isAuthenticated().user && isAuthenticated().user._id == course.instructor._id &&
                            (<span className={classes.action}>
                                <Link to={"/teach/course/edit/" + course._id}>
                                    <IconButton aria-label="Edit" color="secondary">
                                        <Edit />
                                    </IconButton>
                                </Link>
                                {!course.published ? (
                                    <>
                                        <Button color="secondary" variant="outlined" onClick={clickPublish}>{course.lessons.length == 0 ? "Add atleast 1 lesson to publish" : "Publish"}</Button>
                                        <DeleteCourse course={course} onRemove={removeCourse} />
                                    </>) : (
                                        <Button color="primary" variant="outlined">Published</Button>
                                    )
                                }
                            </span>)
                        }
                        {course.published && (<div>
                            <span className={classes.statSpan}><Group /> {stats.totalEnrolled} enrolled </span>
                            <span className={classes.statSpan}><VerifiedUser /> {stats.totalCompleted} completed </span>
                        </div>
                        )}

                    </>
                    }
                />
                <div className={classes.flex}>
                    <CardMedia
                        className={classes.media}
                        image={imageUrl}
                        title={course.name}
                    />
                    <div className={classes.details}>
                        <Typography variant="body1" className={classes.subheading}>
                            {course.description}<br />
                        </Typography>

                        {course.published && <div className={classes.enroll}><Enroll courseId={course._id} /></div>}


                    </div>
                </div>
                <Divider />
                <div>
                    <CardHeader
                        title={<Typography variant="h6" className={classes.subheading}>Lessons</Typography>
                        }
                        subheader={<Typography variant="body1" className={classes.subheading}>{course.lessons && course.lessons.length} lessons</Typography>}
                        action={
                            isAuthenticated().user && isAuthenticated().user._id == course.instructor._id && !course.published &&
                            (<span className={classes.action}>
                                <NewLesson courseId={course._id} addLesson={addLesson} />
                            </span>)
                        }
                    />
                    <List>
                        {course.lessons && course.lessons.map((lesson, index) => {
                            return (<span key={index}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            {index + 1}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={lesson.title}
                                    />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </span>)
                        }
                        )}
                    </List>
                </div>
            </Card>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Publish Course</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Publishing your course will make it live to students for enrollment. </Typography><Typography variant="body1">Make sure all lessons are added and ready for publishing.</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant="contained">
                        Cancel
                    </Button>
                    <Button onClick={publish} color="secondary" variant="contained">
                        Publish
                    </Button>
                </DialogActions>
            </Dialog>
        </div>)
}
