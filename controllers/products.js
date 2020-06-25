const Product = require('../models/Product');

const getProducts = async (req, res) => {
  const [products] = await Product.fetchAllProducts();
  res.render('shop/index', {
    pageTitle: 'Shop',
    products
  });
}

const getProduct = async (req, res) => {
  const productId = req.params.productId;
  const [neededProduct] = await Product.findById(productId);
  res.render('shop/card', {
    pageTitle: 'Shop Card',
    ...neededProduct
  });
}

module.exports = {
  getProducts,
  getProduct
};

