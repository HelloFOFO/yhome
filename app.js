var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
let session      = require('express-session')
var logger = require('morgan');
var schedule = require('node-schedule');
var jobs = require('./libs/jobs');
var webAction = require('./action/webAction')
var moment = require('moment');
let underscore = require('underscore')

var indexRouter = require('./routes/index');

var app = express();

// schedule.scheduleJob('25 03 * * * ', jobs.update_sd_rfdl)


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.moment = moment;
app.locals._ = underscore;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//设置session
app.use(session({
    secret: 'rta',
    // store: new RedisStore({
    //     host: '127.0.0.1'
    // }),
    cookie : { maxAge : 180000000 },
    resave: false,
    saveUninitialized: true
}))

app.use('/', indexRouter);



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
