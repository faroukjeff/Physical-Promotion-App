var express = require('express');
const mongoose = require('mongoose');
var userRouter = require("./routes/users/users");
var supervisorRouter = require("./routes/supervisor/supervisor");
var notifiesRouter = require("./routes/notifies/notifies");
var formsRouter = require("./routes/forms/forms");
var cors = require('cors')
require('dotenv').config();
const bp = require("body-parser");
const notification = require('./src/Notifies/notificationCron');

var app = express();
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/supervisor", supervisorRouter);
app.use("/notifies", notifiesRouter);
app.use("/", formsRouter);
const port = process.env.PORT || 3001

notification.notificationJob();

app.listen(port, function () {
  console.log('Running on port: ' + port);
  //DB conenction
  var mongoDB = process.env.DB_URI;
  mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
});