const Product = require('../models/Product');

const createProduct = async (req, res) => {
  const { title, price, description, imageUrl } = req.body;
  try {
    await new Product(title, price, description, imageUrl, null, req.user._id).save();
  } catch(e) {
    console.log(e);
  }
  res.redirect('/');
};

const getAllProducts = async (req, res) => {
  const products = await Product.fetchAll();
  res.render('shop/index', {
    pageTitle: 'Add Product',
    edit: true,
    products
  });
};

const getAddProduct = (req, res) => {
  res.render('admin/addProduct', {
    pageTitle: 'Add Product',
    edit: false
  });
};

const getEditProduct = async (req, res) => {
  const id = req.params.id;
  const neededProduct = await Product.findById(id);

  res.render('admin/addProduct', {
    pageTitle: 'Edit Product',
    edit: true,
    ...neededProduct
  });
};

const editProduct = async (req, res) => {
  const { title, price, description, imageUrl, id } = req.body;
  await new Product(title, price, description, imageUrl, id).save();
  res.redirect('/admin');
};

const deleteProduct = async (req, res) => {
  const { id } = req.body;
  await Product.deleteById(id);
  res.redirect('/admin');
};

module.exports = {
  createProduct,
  getAddProduct,
  getAllProducts,
  getEditProduct,
  editProduct,
  deleteProduct
};