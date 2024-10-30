import { clearJWT, isAuthenticated } from './../auth/api-helper';
import { remove } from './api-user';
import { useNavigate } from "react-router-dom";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useEffect, useState } from "react";
import React from 'react';
import { DeleteForever } from '@mui/icons-material';
const DeleteUser = (props) => {
    const [open, setOpen] = useState(false);
    const [redirected, setRedirected] = useState(false);
    const navigate = useNavigate();
    const clickButton = () => {
        setOpen(true);
    }
    const handleRequestClose = () => {
        setOpen(false);
    }
    const deleteAccount = () => {
        const jwt = isAuthenticated();
        remove({
            userId: props.userId
        }, { t: jwt.token }).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                clearJWT(() => {
                    console.log('deleted');
                    setRedirected(true);
                })
            }
        });
    }
    if (redirected) navigate("/");// redirect("/");

    return (
        <>
            <IconButton area-label="Delete"
                onClick={clickButton} color="secondary">
                <DeleteForever />
            </IconButton>

            <Dialog open={open} onClose={handleRequestClose}>
                <DialogTitle>{"Delete Account"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Confirm to delete Your Account.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={deleteAccount}
                        color="secondary" autoFocus="autoFocus">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

/*DeleteUser.propTypes = {
    userId: propTypes.string.isRequired
};*/
export default DeleteUser;