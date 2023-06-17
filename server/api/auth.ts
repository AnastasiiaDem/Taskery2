// @ts-ignore
const app = require("../src/server");
const routes = require("../routes/routes");

app.use("/api/", routes);

module.exports = app;
