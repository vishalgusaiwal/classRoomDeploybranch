import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/api-helper';
import { complete, read } from './api-enrollment';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Drawer, ListItemIcon, Divider, ListSubheader, ListItemAvatar, Avatar,Card,CardHeader,Typography,CardMedia,CardContent,CardActions,Button } from '@mui/material';
import { Info, CheckCircle, RadioButtonChecked as RadioButtonUncheckedIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
const base_url = import.meta.env.VITE_API_BASE_URL;


const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 800,
        margin: 'auto',
        marginTop: theme.spacing(40),
        marginLeft: 250
    },
    heading: {
        marginBottom: theme.spacing(3),
        fontWeight: 200
    },
    flex: {
        display: 'flex',
        marginBottom: 20
    },
    card: {
        padding: '24px 40px 20px'
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
    avatar: {
        color: '#9b9b9b',
        border: '1px solid #bdbdbd',
        background: 'none'
    },
    media: {
        height: 180,
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
        margin: '8px 24px',
        display: 'inline-block'
    },
    drawer: {
        width: 240,
        flexShrink: 0,
    },
    drawerPaper: {
        width: 240,
        backgroundColor: '#616161'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    selectedDrawer: {
        backgroundColor: '#e9e3df'
    },
    unselected: {
        backgroundColor: '#ffffff'
    },
    check: {
        color: '#38cc38'
    },
    subhead: {
        fontSize: '1.2em'
    },
    progress: {
        textAlign: 'center',
        color: '#dfdfdf',
        '& span': {
            color: '#fffde7',
            fontSize: '1.15em'
        }
    },
    para: {
        whiteSpace: 'pre-wrap'
    }
}))

export default function Enrollment() {
    const [enrollment, setEnrollment] = useState({ course: { instructor: [] },lessonStatus:[] });
    const [values, setValues] = useState({
        redirect: false,
        error: '',
        drawer: -1
    });
    const jwt = isAuthenticated();
    const params = useParams();
    const classes = useStyles();
    const [totalComplete, setTotalComplete] = useState(0);
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        read({ enrollmentId: params.enrollmentId }, { t: jwt.token }, signal).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setEnrollment({ ...enrollment, course: data.course, lessonStatus: data.lessonStatus });
            }
        });
        return function cleanup() {
            abortController.abort();
        }
    }, [params.enrollmentId]);

    const selectDrawer = (index) => event => {
        setValues({ ...values, drawer: index });
    }
    const totalCompleted = (lessons) => {
        let count = lessons.reduce((total, lessonStatus) => {
            return total + (lessonStatus.complete ? 1 : 0);
        }, 0);
        setTotalComplete(count);
        return count;
    }
    const markComplete = () => {
        if (!enrollment.lessonStatus[values.drawer].complete) {
            const lessonStatus = enrollment.lessonStatus;
            lessonStatus[values.drawer].complete = true;
            let count = totalCompleted(lessonStatus);
            let updatedData = {}
            updatedData.complete = true;
            updatedData.lessonStatusId = lessonStatus[values.drawer]._id;
            if (count == lessonStatus.length) {
                updatedData.courseCompleted = Date.now();
            }
            complete({ enrollmentId: params.enrollmentId }, { t: jwt.token }, updatedData).then((data) => {
                if (data && data.error) {
                    setValues({ ...values, error: data.error });
                } else {
                    setEnrollment({ ...enrollment, lessonStatus: lessonStatus });
                }
            });
        }
    }
    const imageUrl = enrollment.course._id ? base_url+'/course/api/courses/photo/' + enrollment.course._id + "?" + new Date().getTime() : `/api/courses/defaultPhoto`;
    return (
        <Card className={classes.root}>
            <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }}>
                <div className={classes.toolbar} />
                <List>
                    <ListItem button onClick={selectDrawer(-1)} className={values.drawer === -1 ? classes.selectedDrawer : classes.unselected}>
                        <ListItemIcon><Info /></ListItemIcon>
                        <ListItemText primary={"Course overview"} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListSubheader component="div">
                        Lessons
                    </ListSubheader>
                    {enrollment.course.lessons && enrollment.course.lessons.length > 0 && enrollment.course.lessons.map((lesson, index) => (
                        <ListItem button key={index} onClick={selectDrawer(index)} className={values.drawer === index ? classes.selectedDrawer : classes.unselected}>
                            <ListItemAvatar>
                                <Avatar>{index + 1}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={lesson.title} />
                            <ListItemSecondaryAction>{lesson.complete ?
                                <CheckCircle /> : <RadioButtonUncheckedIcon />
                            }
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemText primary={<div className={classes.progress}><span>{totalComplete}</span> out of <span>{enrollment.lessonStatus.length}</span> completed</div>} />
                    </ListItem>
                </List>
            </Drawer>
            {values.drawer == - 1 &&
            <Card className={classes.card}>
                    <CardHeader
                        title={enrollment.course.name}
                        subheader={<div>
                            <Link to={"/user/" + enrollment.course.instructor._id} className={classes.sub}>By {enrollment.course.instructor.name}</Link>
                            <span className={classes.category}>{enrollment.course.category}</span>
                        </div>
                        }
                        action={
                            totalComplete == enrollment.lessonStatus.length &&
                            (<span className={classes.action}>
                                <Button variant="contained" color="secondary">
                                    <CheckCircle /> &nbsp; Completed
                                </Button>
                            </span>)
                        }
                    />
                    <div className={classes.flex}>
                        <CardMedia
                            className={classes.media}
                            image={imageUrl}
                            title={enrollment.course.name}
                        />
                        <div className={classes.details}>
                            <Typography variant="body1" className={classes.subheading}>
                                {enrollment.course.description}<br />
                            </Typography>
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <CardHeader
                            title={<Typography variant="h6" className={classes.subheading}>Lessons</Typography>
                            }
                            subheader={<Typography variant="body1" className={classes.subheading}>{enrollment.course.lessons && enrollment.course.lessons.length} lessons</Typography>}
                            action={
                                isAuthenticated().user && isAuthenticated().user._id == enrollment.course.instructor._id &&
                                (<span className={classes.action}>

                                </span>)
                            }
                        />
                        <List>
                            {enrollment.course.lessons && enrollment.course.lessons.map((lesson, i) => {
                                return (<span key={i}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {i + 1}
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
                </Card>}
            {values.drawer != -1 && (<>
            <Typography variant="h5" className={classes.heading}>{enrollment.course.name}</Typography>
            <Card className={classes.card}>
                    <CardHeader
                        title={enrollment.course.lessons[values.drawer].title}
                        action={<Button onClick={markComplete} variant={(enrollment.lessonStatus[values.drawer].complete) ? 'contained' : 'outlined'} color="secondary">{(enrollment.lessonStatus[values.drawer].complete) ? "Completed" : "Mark as complete"}</Button>} />
                    <CardContent>
                        <Typography variant="body1" className={classes.para}>{enrollment.course.lessons[values.drawer].content}</Typography>
                    </CardContent>
                    <CardActions>
                        <a href={enrollment.course.lessons[values.drawer].resource_url}><Button variant="contained" color="primary">Resource Link</Button></a>
                    </CardActions>
                </Card></>)}
        </Card>
    )
}