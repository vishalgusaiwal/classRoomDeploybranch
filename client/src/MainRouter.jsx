import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Signin from './auth/Signin';
import Home from './core/Home';
import Menu from './core/Menu';
import theme from './theme';
import Signup from './user/Signup';
import Profile from './user/Profile';
import PrivateRoute from './auth/PrivateRoute';
import Users from './user/Users';
import EditProfile from './user/EditProfile';
import MyCourse from './course/MyCourses';
import NewCourse from './course/NewCourse';
import Course from './course/Course';
import EditCourse from './course/EditCourse';
import Enrollment from './enrollment/Enrollment';

export default function MainRouter() {
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <div>
                    <Menu />
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/signin" element={<Signin />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/users" element={<Users />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/user/edit/:userId" element={<EditProfile />} />
                            <Route path="/user/:userId" element={<Profile />} />
                            <Route path="/teach/courses" element={<MyCourse />} />
                            <Route path="/teach/course/new" element={<NewCourse />} />
                            <Route path="/teach/course/:courseId" element={<Course />} />
                            <Route path="/teach/course/edit/:courseId" element={<EditCourse />} />
                            <Route path="/learn/:enrollmentId" element={<Enrollment />} />
                        </Route>
                    </Routes>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}