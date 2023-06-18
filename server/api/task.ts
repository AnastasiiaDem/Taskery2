// @ts-ignore
const app = require("../src/server");
const task = require("../routes/task");

app.use("/api/", task);

module.exports = app;
