const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", ensureGuest, (req, res) => {
    res.render("login", {
        layout: "login",
    });
});

router.get("/dashboard", ensureAuth, (req, res) => {
    res.render("dashboard");
});

router.use("/api-docs", ensureAuth, require("./swagger"));
router.use("/movies", require("./movies"));

module.exports = router;
