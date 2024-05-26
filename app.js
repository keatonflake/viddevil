const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const routes = require("./routes/index.js");

const port = process.env.PORT || 8080;
const app = express();

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use("/", routes);

mongodb.initDb((err) => {
  if (err) {
    console.error("Failed to initialize database:", err);
  } else {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
});
