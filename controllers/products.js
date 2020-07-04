const Product = require('../models/Product');

const getProducts = async (req, res) => {
  const products = await Product.fetchAll();
  res.render('shop/index', {
    pageTitle: 'Shop',
    edit: false,
    products
  });
};

const getProduct = async (req, res) => {
  const productId = req.params.productId;
  const neededProduct = await Product.findById(productId);

  res.render('shop/description', {
    pageTitle: 'Description Page',
    ...neededProduct
  });
};

const addToCart = async (req, res) => {
  const productId = req.body.id;
  const neededProduct = await Product.findById(productId);
  await req.user.addToCart(neededProduct);
  res.redirect('/cart');
};

const getCart = async (req, res) => {
  const prods = await req.user.getCart();
  res.render('shop/cart', {
    pageTitle: 'Cart Page',
    products: prods
  });
};

const deleteCartItem = async (req, res) => {
  const productId = req.body.id;
  await req.user.deleteFormCart(productId);
  res.redirect('/cart');
};

const makeOrder = async (req, res) => {
  await req.user.makeOrder();
  res.redirect('/orders');
};

const getOrders = async (req, res) => {
  const orders = await req.user.getOrders();
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

