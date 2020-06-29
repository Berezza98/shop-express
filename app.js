const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./utils/db');

//CONTROLLERS
const { get404 } = require('./controllers/errors');

//MODELS
const Product = require('./models/Product');
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
  const myUser = await User.findByPk(1);
  req.user = myUser;
  next();
});

app.use(shopRouter);
app.use('/admin', adminRouter); // START FROM /admin URL(like filter)

app.use(get404);

async function main() {
  Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
  User.hasMany(Product);
  await sequelize.sync({ force: false }); //force: true - recreate all tables
  const me = await User.findByPk(1);
  if (!me) {
    User.create({
      name: 'Roman',
      email: 'berezdecky98@gmai.com'
    });
  }
  app.listen(3300, () => console.log('SERVER IS RUNNING ON PORT 3300'));
}

main();