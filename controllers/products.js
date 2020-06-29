const Product = require('../models/Product');

const getProducts = async (req, res) => {
  const products = await Product.findAll();
  res.render('shop/index', {
    pageTitle: 'Shop',
    edit: false,
    products
  });
}

const getProduct = async (req, res) => {
  const productId = req.params.productId;
  const neededProduct = await Product.findByPk(productId);

  res.render('shop/card', {
    pageTitle: 'Shop Card',
    ...neededProduct.dataValues
  });
}

module.exports = {
  getProducts,
  getProduct
};

