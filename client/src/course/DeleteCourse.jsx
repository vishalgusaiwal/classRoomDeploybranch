import { useState } from 'react';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { isAuthenticated } from './../auth/api-helper';
import {remove} from './api-course.js'

export default function DeleteCourse(props) {
  const [open, setOpen] = useState(false)
  
  const jwt = isAuthenticated()
  const clickButton = () => {
    setOpen(true)
  }
  const deleteCourse = () => {
    remove({
      courseId: props.course._id
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setOpen(false)
        props.onRemove(props.course)
      }
    })
  }
  const handleRequestClose = () => {
    setOpen(false)
  }
    return (<>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <DeleteIcon/>
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete "+props.course.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your course {props.course.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteCourse} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>)
};