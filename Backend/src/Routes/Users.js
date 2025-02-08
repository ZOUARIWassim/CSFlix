const express = require('express');
const router = express.Router();
const logInRoutes = require("./Login")
const logOutRoutes = require("./Logout")

router.use('/login', logInRoutes);

router.use('/logout', logOutRoutes);

router.get('/auth/profile', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome ${req.session.user}`);
    } else {
        res.send('You are not logged in');
    }
});


module.exports = router;
