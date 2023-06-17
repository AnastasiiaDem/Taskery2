require('dotenv').config();

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());

const serverless = require('serverless-http');
const cors = require('cors');
const apiRoutes = require('./src/routes/routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const { MONGODB_LINK, MONGODB_LOCAL } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req: any, res: { setHeader: (arg0: string, arg1: string) => void; }, next: () => void) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

mongoose
  .connect(MONGODB_LINK, {
    useNewUrlParser: true,
  })
  .catch((err: any) => console.log(err));
mongoose.connection.on('connected', () => console.log('Connected to db'));

app.listen(PORT, () => {
  console.log(`Server is working on ${PORT} port`);
});

app.use('/api', apiRoutes);

module.exports = app;
module.exports.handler = serverless(app);
