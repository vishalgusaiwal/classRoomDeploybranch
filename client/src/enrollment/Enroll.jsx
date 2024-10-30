import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAuthenticated } from '../auth/api-helper';
import { create } from './api-enrollment';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';


export default function Enroll(props) {
    const [values, setValues] = useState({
        enrollmentId: '',
        error: '',
        redirect: ''
    });
    const navigate = useNavigate();
    if (values.redirect) navigate('/learn/' + values.enrollmentId);
    const clickEnroll = () => {
        const jwt = isAuthenticated();
        create({ courseId: props.courseId }, { t: jwt.token }).then((data) => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setValues({ ...values, enrollmentId: data._id, redirect: true });
            }
        });
    }
    if (values.redirect == true) navigate('/learn/' + values.enrollmentId);
    return (
        <Button variant="contained" color="secondary" onClick={clickEnroll}>Enroll</Button>
    );
}

Enroll.propTypes = {
    courseId: PropTypes.string.isRequired
}