const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session'); //give cookies
const passport = require('passport'); //tell it to keep track of user state thru cookies
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json()); //appends post request data to req.body
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000, //milliseconds
        //to encrypt cookies to prevent tampering/hacking, array allows random key selection as add. security
        keys: [keys.cookieKey] 
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if(process.env.NODE_ENV === 'production') {
    // Express serves production assets if
    // server route not found
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);