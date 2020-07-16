const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    await new Product({ ...req.body, userId: req.user }).save();
  } catch(e) {
    console.log(e);
  }
  res.redirect('/');
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({ userId: req.user._id });
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
  const { title, price, description, imageUrl, _id } = await Product.findById(id);

  res.render('admin/addProduct', {
    pageTitle: 'Edit Product',
    edit: true,
    title,
    price,
    description,
    imageUrl,
    _id
  });
};

const editProduct = async (req, res) => {
  const { title, price, description, imageUrl, id } = req.body;
  const product = await Product.findById(id);

  if (!product.userId.equals(req.user._id)) {
    return res.redirect('/');
  }

  product.title = title;
  product.price = price;
  product.description = description;
  product.imageUrl = imageUrl;
  await product.save();
  res.redirect('/admin');
};

const deleteProduct = async (req, res) => {
  const { id } = req.body;
  await Product.deleteOne({ _id: id, userId: req.user._id })
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