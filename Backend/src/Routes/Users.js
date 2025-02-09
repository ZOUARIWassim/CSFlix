const express = require('express');
const router = express.Router();
const logInRoutes = require("./Login")
const logOutRoutes = require("./Logout")

router.use('/login', logInRoutes);

router.use('/logout', logOutRoutes);

router.get('/auth/profile', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ auth: true });
    } else {
        res.status(401).json({ auth: false });
    }
});


module.exports = router;
