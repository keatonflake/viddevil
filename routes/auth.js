const express = require("express");
const passport = require("passport");
const router = express.Router();

// Login/landing page
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: 
"/" }), (req, res) => {
    res.redirect("/dashboard");
});

// router.use('/api-docs', require('./swagger'));
// router.use('/movies', require('./movies'));

module.exports = router;
