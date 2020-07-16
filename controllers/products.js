const Product = require('../models/Product');
const Order = require('../models/Order');

const getProducts = async (req, res) => {
  const products = await Product.find();
  res.render('shop/index', {
    pageTitle: 'Shop',
    edit: false,
    products
  });
};

const getProduct = async (req, res) => {
  const productId = req.params.productId;
  const { title, price, description, imageUrl } = await Product.findById(productId);
  res.render('shop/description', {
    pageTitle: 'Description Page',
    title,
    price,
    description,
    imageUrl
  });
};

const addToCart = async (req, res) => {
  const productId = req.body.id;
  const neededProduct = await Product.findById(productId);
  await req.user.addToCart(neededProduct);
  res.redirect('/cart');
};

const getCart = async (req, res) => {
  const user = await req.user.populate('cart.items.productId').execPopulate();
  res.render('shop/cart', {
    pageTitle: 'Cart Page',
    products: user.cart.items
  });
};

const deleteCartItem = async (req, res) => {
  const productId = req.body.id;
  await req.user.deleteFormCart(productId);
  res.redirect('/cart');
};

const makeOrder = async (req, res) => {
  const user = await req.user.populate('cart.items.productId').execPopulate();
  const products = user.cart.items.map(item => ({ quantity: item.quantity, product: { ...item.productId._doc } }))
  await new Order({
    user: {
      email: req.user.email,
      userId: req.user
    },
    products
  }).save();
  await req.user.clearCart();
  res.redirect('/orders');
};

const getOrders = async (req, res) => {
  const orders = await Order.find({ 'user.userId': req.user._id });
  res.render('shop/orders', {
    pageTitle: 'Orders',
    orders
  });
};

module.exports = {
  getProducts,
  getProduct,
  addToCart,
  getCart,
  deleteCartItem,
  makeOrder,
  getOrders
};

