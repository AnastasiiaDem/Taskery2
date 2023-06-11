require('dotenv').config();

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require('cors');
const apiRoutes = require('./routes/routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const {MONGODB_LINK, MONGODB_LOCAL} = process.env;

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors(corsOptions));

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
