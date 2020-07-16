const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);

//CONTROLLERS
const { get404 } = require('./controllers/errors');

//MODELS
const User = require('./models/User');

//ROUTERS
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

const app = express();
const store = new MongoStore({
  mongooseConnection: mongoose.connection,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views'); // folder with views

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'longSecret1234',
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(csrfProtection);
app.use(flash());

//GET USER MIDDLEWARE
app.use(async (req, res, next) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user._id);
    req.user = user;
  }
  next();
});

app.use((req, res, next) => {
  res.locals = {
    csrfToken: req.csrfToken(),
    loggedIn: req.session.loggedIn
  };
  next();
});

app.use(shopRouter);
app.use('/admin', adminRouter); // START FROM /admin URL(like filter)
app.use(authRouter);

app.use(get404);

async function main() {
  await mongoose.connect('mongodb+srv://roman:Berezza98@cluster0-f6ftl.mongodb.net/shop?retryWrites=true&w=majority');
  app.listen(3300, () => console.log('SERVER IS RUNNING ON PORT 3300'));
}

main();