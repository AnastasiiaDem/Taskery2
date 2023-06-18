// @ts-ignore
const app = require("../src/server");
const ai = require("../routes/ai");

app.use("/api/", ai);

module.exports = app;
