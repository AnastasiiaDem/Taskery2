// @ts-ignore
const app = require("../src/server");
const contact = require("../routes/contact");

app.use("/api/", contact);

module.exports = app;
