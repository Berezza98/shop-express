const Product = require('../models/Product');

const getAddProduct = (req, res) => {
  res.render('admin/addProduct', {
    pageTitle: 'Add Product'
  });
};

const createProduct = async (req, res) => {
  const product = new Product(req.body.title);
  await Product.save(product);
  res.redirect('/');
};

const getProducts = async (req, res) => {
  const products = await Product.fetchAllProducts();
  res.render('shop/index', {
    pageTitle: 'Shop',
    items: products
  });
}

const getProduct = async (req, res) => {
  const productId = req.params.productId;
  const products = await Product.fetchAllProducts();
  const neededProduct = products.find(prod => prod.id === productId);
  res.render('shop/card', {
    pageTitle: 'Shop Card',
    ...neededProduct
  });
}

module.exports = {
  getAddProduct,
  createProduct,
  getProducts,
  getProduct
};

