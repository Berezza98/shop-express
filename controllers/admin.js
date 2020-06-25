const Product = require('../models/Product');

const createProduct = async (req, res) => {
  const { title, price, description, imageUrl } = req.body;
  await new Product(title, price, description, imageUrl).save();
  res.redirect('/');
};

const getAddProduct = (req, res) => {
  res.render('admin/addProduct', {
    pageTitle: 'Add Product'
  });
};

module.exports = {
  createProduct,
  getAddProduct
};