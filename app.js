var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var cookieSession = require('cookie-session');
var Event = require('./calendar-client');
var moment = require('moment');
var bodyParser = require('body-parser');

var app = express();

app.use(cookieSession({
    keys : ['asasjnjabskjabskkas', 'asnjkashjkajkshk']
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended : true } ));

passport.use(new GoogleStrategy({
    clientID : "426887652482-jgijp4rrqtkb309168mtlvgvqs7s3qpa.apps.googleusercontent.com",
    clientSecret : "3Kf5L_q-RgloZ2Gj_pg4XNvf",
    callbackURL : "http://localhost:8080/auth/google/callback",
}, (accessToken, refreshToken, profile, cb) => {
    var user = {
        accessToken : accessToken,
        refreshToken : refreshToken,
        profile : profile
    };

    return cb(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.set('view engine', 'pug');

app.get('/', (req, res) => {

    if (isLoggedIn(req)) {
        res.render("home");

        /*var event  = new Event(req.session.passport.user.accessToken);

        event.all((data) => {
            res.send(data);
        });*/

    } else {
        res.render('index');
    }
});

app.post('/events', (req, res) => {
    var eventOptions = {
        "summary" : req.body.summary,
        "description" : req.body.description,
        "start" : {
            "dateTime" : moment(req.body.start).toISOString()
        },
        "end" : {
            "dateTime" : moment(req.body.end).toISOString()
        }
    };

    var event = new Event(req.session.passport.user.accessToken);

    event.create(eventOptions, (event) => {
        res.render("event", {event : event});
    });
});

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/');
}) 

app.post('/login', passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.email']
}));

app.post('/logout', (req, res) => {
    if (isLoggedIn(req)) {
        req.session.passport.user = null;
    }

    res.redirect('/');
});

isLoggedIn = (req) => {
    return typeof req.session.passport !== "undefined" && req.session.passport.user;
}

app.listen(8080);