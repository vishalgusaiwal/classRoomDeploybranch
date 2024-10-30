const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const app = require('./express');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.mongoUri).then(() => {
    console.log('Database Connnected successfully');
}).catch((err) => {
    console.log(err);
});

/*app.post("/users/api/signup", (req, res) => {
    res.status(200).json({msg : "Working"})
})*/
app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`server started on %s: `, process.env.PORT);
});


