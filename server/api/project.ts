// @ts-ignore
const app = require("../src/server");
const project = require("../routes/project");

app.use("/api/", project);

module.exports = app;
