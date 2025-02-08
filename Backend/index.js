const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const session = require('express-session');
require('dotenv').config();

const signUpRoutes = require('./src/Routes/SignUp');
const UserRoutes = require('./src/Routes/Users');
const MoviesRoutes =  require('./src/Routes/Movies');

app = express();
const PORT = process.env.PORT || 5000;
const Frontend = process.env.FrontendServer || "http://localhost:5173";

app.use(express.json());


app.use(cors({
    origin: Frontend,
    credentials: true
})); 

app.use("/user",session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true}
))

app.use("/user/auth/*", function auth(req, res, next){
    if(res.session.authorization){
        let token = res.session.authorization["accessToken"];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(!err){
                req.user = user;
                next();
            }else{
                res.status(403).json({ message: "User not authenticated" });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(403).json({ message: "User not logged in" });
    }
});


app.use('/signup', signUpRoutes);
app.use('/user', UserRoutes);
app.use('/movies', MoviesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});