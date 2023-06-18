// @ts-ignore
const app = require("../src/server");
const user = require("../routes/user");

app.use("/api/", user);

module.exports = app;
