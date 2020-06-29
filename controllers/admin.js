const Product = require('../models/Product');

const createProduct = async (req, res) => {
  const { title, price, description, imageUrl } = req.body;
  try {
    await req.user.createProduct({
      title,
      price,
      description,
      imageUrl
    });
  } catch(e) {
    console.log(e);
  }
  res.redirect('/');
};

const getAllProducts = async (req, res) => {
  const products = await req.user.getProducts();
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
  const [neededProduct] = await req.user.getProducts({ where: { id } });

  res.render('admin/addProduct', {
    pageTitle: 'Edit Product',
    edit: true,
    ...neededProduct.dataValues
  });
};

const editProduct = async (req, res) => {
  const { id } = req.body;
  const neededProduct = await Product.findByPk(id);
  await Object.assign(neededProduct, req.body).save();
  res.redirect('/admin');
};

const deleteProduct = async (req, res) => {
  const { id } = req.body;
  const neededProduct = await Product.findByPk(id);
  await neededProduct.destroy();
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