import { useState } from 'react';
import PropTypes from 'prop-types';
import { isAuthenticated } from '../auth/api-helper';
import { newLesson } from './api-course';
import { Button, Dialog, DialogContent, DialogActions, DialogTitle, TextField } from '@mui/material';
import { AddBox } from '@mui/icons-material';
import {makeStyles} from '@mui/styles';


const useStyles = makeStyles(theme => {
    form: {
        minWidth: 700
    }
});
export default function NewLesson(props) {
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState({
        title: '',
        content: '',
        resource_url: ''
    });
    const classes = useStyles();
    const handleClickOpen = () =>{
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    }
    const ClickSubmit = () => {
        const jwt = isAuthenticated();
        const lesson = {
            title: values.title || undefined,
            content: values.content || undefined,
            resource_url: values.resource_url || undefined
        }
        newLesson({ courseId: props.courseId }, { t: jwt.token }, lesson).then((data) => {
            if (data && data.error) {
                setValues({ ...values, error: data.error });
            } else {
                props.addLesson(data.lesson);
                setValues({ ...values, title: '', content: '', resource_url: '' });
                setOpen(false);
            }
        });
    }
    return (
        <> 
            <Button aria-label="Add Lesson" color="primary" variant="contained" onClick={handleClickOpen}>
                <AddBox/> New Lesson
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <div className={classes.form}>
                    <DialogTitle id="form-dialog-title">Add New Lesson</DialogTitle>
                    <DialogContent>
                        <TextField label="Title" type="text" fullWidth value={values.title} onChange={handleChange('title')} />
                        <br />
                        <TextField label="Content" type="text" fullWidth multiline rows="5" value={values.content} onChange={handleChange('content')} />
                        <br />
                        <TextField label="Resource link" type="text" fullWidth value={values.resource_url} onChange={handleChange('resource_url')} />
                        <br/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" variant="contained">Cancel</Button>
                        <Button onClick={ClickSubmit} color="secondary" variant="contained">Add</Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    )
}

NewLesson.prototype = {
    courseId: PropTypes.string.isRequired,
    addLesson: PropTypes.func.isRequired
};