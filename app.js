const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

//CONTROLLERS
const { get404 } = require('./controllers/errors');

//ROUTERS
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // folder with views

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(shopRouter);
app.use('/admin', adminRouter); // START FROM /admin URL(like filter)

app.use(get404);

app.listen(3300, () => console.log('SERVER IS RUNNING ON PORT 3300'));