const fs = require('fs');
const util = require('util');
const path = require('path');

const Product = require('../models/Product');
const { ITEMS_PER_PAGE } = require('../constants/general');

const asyncUnlink = util.promisify(fs.unlink);

const createProduct = async (req, res, next) => {
  try {
    const { path } = req.file || {};
    await new Product({
      ...req.body,
      userId: req.user,
      imageUrl: path
    }).save();
    res.redirect('/');
  } catch(error) {
    next(new Error(error));
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const pagesCount = Math.ceil((await Product.countDocuments()) / ITEMS_PER_PAGE);
    const products = await Product.find({ userId: req.user._id });
    res.render('shop/index', {
      pageTitle: 'Add Product',
      edit: true,
      currentPage: page,
      products,
      pagesCount
    });
  } catch(error) {
    next(new Error(error));
  }
};

const getAddProduct = (req, res) => {
  res.render('admin/addProduct', {
    pageTitle: 'Add Product',
    edit: false
  });
};

const getEditProduct = async (req, res, next) => {
  try {
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
  } catch(error) {
    next(new Error(error));
  }

};

const editProduct = async (req, res) => {
  try {
    const { path: imagePath } = req.file || {};
    const { title, price, description, id } = req.body;
    const product = await Product.findById(id);
  
    if (!product.userId.equals(req.user._id)) {
      return res.redirect('/');
    }
  
    product.title = title;
    product.price = price;
    product.description = description;
    if (imagePath) {
      const normilizedPath = path.normalize(product.imageUrl);
      asyncUnlink(normilizedPath).catch(e => { throw e });
      product.imageUrl = imagePath;
    }
    await product.save();
    res.redirect('/admin');
  } catch(error) {
    next(new Error(error));
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.find({ _id: id, userId: req.user._id });
    if (product.imageUrl) {
      const imagePath = path.normalize(product.imageUrl);
      asyncUnlink(imagePath).catch(e => { throw e });
    }
    await Product.deleteOne({ _id: id, userId: req.user._id });
    res.redirect('/admin');
  } catch(error) {
    next(new Error(error));
  }
};

module.exports = {
  createProduct,
  getAddProduct,
  getAllProducts,
  getEditProduct,
  editProduct,
  deleteProduct
};