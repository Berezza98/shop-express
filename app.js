const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const { mongoConnect } = require('./utils/db');

//CONTROLLERS
const { get404 } = require('./controllers/errors');

//MODELS
const User = require('./models/User');

//ROUTERS
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // folder with views

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//GET USER MIDDLEWARE
app.use(async (req, res, next) => {
  const { name, email, cart, _id } = await User.findById('5efdc0c7bbfbf98ddc0c7a79');
  req.user = new User(name, email, cart, _id);
  next();
});

app.use(shopRouter);
app.use('/admin', adminRouter); // START FROM /admin URL(like filter)

app.use(get404);

async function main() {
  await mongoConnect();
  app.listen(3300, () => console.log('SERVER IS RUNNING ON PORT 3300'));
}

main();