const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cokieParser = require('cookie-parser');
const compress = require('compression');
const helmet = require('helmet');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cokieParser());
app.use(compress());
app.use(cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    optionsSuccessStatus: 200,
    credentials: true,
}));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use('/expenses/users', userRoutes);
app.use('/expenses/auth', authRoutes);
app.use('/expenses/course', courseRoutes);
app.use('/expenses/enrollments', enrollmentRoutes);
app.use('/expenses/*',(req,resp)=>{
    resp.json({"success":"successfully requested to server"});
})

module.exports = app;