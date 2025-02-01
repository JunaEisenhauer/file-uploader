let createError = require('http-errors');
let express = require('express');
let cookieParser = require('cookie-parser');
let cors = require('cors');
let logger = require('morgan');
let exjwt = require('express-jwt');
require('dotenv').config();

let signupRoute = require('./routes/signup');
let loginRoute = require('./routes/login');
let secretRoute = require('./routes/secret');
let fileRoute = require('./routes/file');
let filedataRoute = require('./routes/filedata');

let db = require('./database/models');

let jwtMW = exjwt({ secret: process.env.ACCESS_TOKEN });

let app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

// Middleware to check if user is logged in with a token
app.use((req, res, next) => {
  req.checkUser = callback => {
    jwtMW(req, res, () => {
      if (!req.user) {
        return res.json({ status: 'error', message: 'Not logged in' });
      }

      db.user.findOne({ where: { id: req.user.id } })
        .then(dbUser => {
          if (dbUser === null) {
            return res.json({ status: 'error', message: 'User not found' });
          }

          callback(dbUser);
        });
    });
  };

  next();
});

app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/secret', secretRoute);
app.use('/file', fileRoute);
app.use('/filedata', filedataRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // TODO - change create error
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send error response
  let code = err.status || 500;
  let message = err.message;
  res.status(code);
  res.json({ status: 'error', code: code, message: message });
});

db.sequelize.sync().then(() => {
  console.log('Successfully connected to database!');
});

module.exports = app;
