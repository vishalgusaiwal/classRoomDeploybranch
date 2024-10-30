import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/api-helper';
import { read, update } from './api-course';
import { Card, CardHeader, TextField, Button, CardMedia, List, ListItem, ListItemText, IconButton, ListItemSecondaryAction,ListItemAvatar,Avatar,Divider,Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AddPhotoAlternate as FileUpload, Delete as DeleteIcon, ArrowUpward as ArrowUp } from '@mui/icons-material';
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
    upArrow: {
        border: '2px solid #f57c00',
        marginLeft: 3,
        marginTop: 10,
        padding: 4
    },
    sub: {
        display: 'block',
        margin: '3px 0px 5px 0px',
        fontSize: '0.9em'
    },
    media: {
        height: 250,
        display: 'inline-block',
        width: '50%',
        marginLeft: '16px'
    },
    icon: {
        verticalAlign: 'sub'
    },
    textfield: {
        width: 350
    },
    action: {
        margin: '8px 24px',
        display: 'inline-block'
    }, input: {
        display: 'none'
    },
    filename: {
        marginLeft: '10px'
    },
    list: {
        backgroundColor: '#f3f3f3'
    }
}))
export default function EditCourse() {
    const [values, setValues] = useState({
        name: '',
        descpription: '',
        image: '',
        category: '',
        redirect: false,
        error: ''
    });
    const [course, setCourse] = useState({ instructor: {} });
    const params = useParams();
    const jwt = isAuthenticated();
    const classes = useStyles();
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        read({ courseId: params.courseId }, signal).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setCourse(data);
            }
        });
        return function cleanup() {
            abortController.abort();
        }
    }, [params.courseId]);
    const handleChange = name => event => {
        const value = name == 'image' ? event.target.fiels[0] : event.target.value;
        setCourse({ ...course, [name]: value });
    }
    const ClickSubmit = () => {
        let courseData = new FormData();
        course.name && courseData.append('name', course.name);
        course.descpription && courseData.append('description', course.descpription);
        course.image && courseData.append('image', course.image);
        course.category && courseData.append('category', course.category);
        courseData.append('lessons', JSON.stringify(course.lesssons));
        update({ courseId: params.courseId }, { t: jwt.token }, courseData).then(data => {
            if (data && data.error) {
                console.log(error);
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, redirect: true });
            }
        })
    }
    const handleLessonChange = (name, index) => event => {
        const lessons = course.lessons;
        lessons[index][name] = event.target.value;
        setCourse({ ...course, lessons: lessons });
    }
    const moveUp = index => event => {
        const lessons = course.lessons;
        const moveUp = lessons[index];
        lessons[index] = lessons[index - 1];
        lessons[index - 1] = moveUp;
        setCourse({ ...course, lessons: lessons });
    }
    const deleteLesson = index => event => {
        const lessons = course.lessons;
        lessons.splice(index, 1);
        setCourse({ ...course, lessons: lessons });
    }
    const imageUrl = course._id
        ? `${base_url}/course/api/courses/photo/${course._id}?${new Date().getTime()}`
        : '/api/courses/defaultphoto';
    return (
        <div className={classes.root}>
            <Card className={classes.card}>
                <CardHeader title={<TextField margin="dense" label="Title" type="text" fullWidth value={course.name} onChange={handleChange('name')} />}
                    subheader={<div><Link to={"/user/" + course.instructor._id}>By {course.instructor.name}</Link>
                        {<TextField margin="dense" label="Category" type="text" fullWidth value={course.category} onChange={handleChange('category')} />}
                    </div>}
                    action={isAuthenticated() && isAuthenticated().user._id == course.instructor._id && <span className={classes.action}>< Button variant="contained" color="secondary" onClick={ClickSubmit}>Save</Button></span>}
                />
                <div className={classes.flex}>
                    <CardMedia image={imageUrl} title={course.name} className={classes.media} />
                    <div className={classes.details}>
                        <TextField multiline rows="5" label="Description" type="text" value={course.descpription} onChange={handleChange('description')} />
                        <br />
                        <input accept="image/*" onChange={handleChange('image')} type="file" className={classes.input} id="icon-button-file" />
                        <label htmlFor="icon-button-file">
                            <Button variant="outlined" color="secondary" component="span">
                                Change Photo
                                <FileUpload/>
                            </Button>
                        </label><span className={classes.filename}>{course.image ? course.image.name : ''}</span>
                        <br/>
                    </div>
                </div>
                <Divider/>
                <div>
                    <CardHeader title={<Typography variant="h6" className={classes.subheading}>Lessons - Edit and Rearrange</Typography>}
                        subheader={<Typography variant="body1" className={classes.subheading}>{course.lessons && course.lessons.length} lessons</Typography>}
                    />
                    <List>
                        {course.lessons && course.lessons.map((lesson, index) => {
                            return (
                                <span key={index}>
                                    <ListItem className={classes.list}>
                                        <ListItemAvatar>
                                            <>
                                                <Avatar>
                                                    {index + 1}
                                                </Avatar>
                                                {index != 0 &&
                                                    <IconButton aria-label="up" color="primary" onClick={moveUp(index)} className={classes.upArrow}>
                                                        <ArrowUp />
                                                    </IconButton>
                                                }
                                            </>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<>
                                                <TextField margin="dense" label="Title" type="text" fullWidth value={lesson.title} onChange={handleLessonChange('title', index)} />
                                                <br />
                                                <TextField margin="dense" multiline rows="5" label="Content" type="text" fullWidth value={lesson.content} onChange={handleLessonChange('content', index)} />
                                                <br />
                                                <TextField margin="dense" label="Resource link" type="text" fullWidth value={lesson.resource_url} onChange={handleLessonChange('resource_url', index)} />
                                                <br />
                                            </>}>
                                        </ListItemText>
                                        {
                                            !course.published && <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="up" color="primary" onClick={deleteLesson(index)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        }
                                    </ListItem>
                                    <Divider/>
                                </span>
                            )
                        })}
                    </List>
                </div>
            </Card>
        </div>
    )
}