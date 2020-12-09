const express = require("express");
const os = require("os");
const app = express();

app.use("/", (req, res) => {
  res.send(os.hostname());
});

app.listen(5000, () => console.log("Server up on port 5000."));
