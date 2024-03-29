var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var database = require('./database/database')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var addformsRouter = require('./routes/addforms')
var getformsRouter = require('./routes/getforms')
var getsubjectsRouter = require('./routes/getsubjects')
var getformdataRouter = require('./routes/getformdata')
var addsubjectRouter = require('./routes/addsubject')
var addusersRouter = require('./routes/addusers')
var addadminRouter = require('./routes/addadmin')
var authorizationRouter = require('./routes/authorization')
var checkAuthenticationRouter = require('./routes/checkAuthentication')
var logoutRouter = require('./routes/logout')
var setratingresponseRouter = require('./routes/setratingresponse')
var settextresponseRouter = require('./routes/settextresponse')
var sendReminderRouter = require('./routes/sendreminder');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up CORS middleware
app.use(cors(
  {
    credentials : true,
    origin: `${process.env.FRONT_END_URL}`
  }
));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/addforms', addformsRouter);
app.use('/getforms', getformsRouter);
app.use('/getsubjects', getsubjectsRouter);
app.use('/getformdata', getformdataRouter);
app.use('/addsubject', addsubjectRouter);
app.use('/addusers', addusersRouter);
app.use('/addadmin', addadminRouter);
app.use('/authorization', authorizationRouter);
app.use('/checkauthentication', checkAuthenticationRouter);
app.use('/logout', logoutRouter);
app.use('/setratingresponse', setratingresponseRouter);
app.use('/settextresponse', settextresponseRouter);
app.use('/sendreminder', sendReminderRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
