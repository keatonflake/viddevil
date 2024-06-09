const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("login", {
        layout: "login",
    });
});

router.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

router.use("/api-docs", require("./swagger"));
router.use("/movies", require("./movies"));

module.exports = router;
