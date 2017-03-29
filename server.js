const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// for heroku to set PORT number, defaulting to 3000 if not set
const port = process.env.PORT || 3000;

var app = express();

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


// stops all app.get handlers working because we don't call next()
app.use( (req, res, next) => {
    res.render('maintenance.hbs');
});

app.use((req, res, next ) => {
    var now = new Date().toString();
    var log = `${now}:${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log')
        }
    })
    next();
});

app.use(express.static(__dirname + '/public'));


hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeText: 'Welcome to my new website!'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: "Unable to handle request",
        name: "Server error",
        Code: "404"
    });
});

app.listen(port, () => {
    console.log(`Server is up and listening on port ${port}`);
});