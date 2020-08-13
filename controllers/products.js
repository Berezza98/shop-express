const fs = require('fs');
const path = require('path');

const createPDFStream = require('../utils/invoice');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { ITEMS_PER_PAGE } = require('../constants/general');

const getProducts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const pagesCount = Math.ceil((await Product.countDocuments()) / ITEMS_PER_PAGE);
    const products = await Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
    res.render('shop/index', {
      pageTitle: 'Shop',
      edit: false,
      currentPage: page,
      pagesCount,
      products
    });
  } catch(error) {
    next(new Error(error));
  }
};

const getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { title, price, description, imageUrl } = await Product.findById(productId);
    res.render('shop/description', {
      pageTitle: 'Description Page',
      title,
      price,
      description,
      imageUrl
    });
  } catch(error) {
    next(new Error(error));
  }
};

const addToCart = async (req, res, next) => {
  try {
    const productId = req.body.id;
    const neededProduct = await Product.findById(productId);
    await req.user.addToCart(neededProduct);
    res.redirect('/cart');
  } catch(error) {
    next(new Error(error));
  }
};

const getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId').execPopulate();
    res.render('shop/cart', {
      pageTitle: 'Cart Page',
      products: user.cart.items
    });
  } catch(error) {
    next(new Error(error));
  }
};

const deleteCartItem = async (req, res, next) => {
  try {
    const productId = req.body.id;
    await req.user.deleteFormCart(productId);
    res.redirect('/cart');
  } catch(error) {
    next(new Error(error));
  }
};

const makeOrder = async (req, res, next) => {
  try {
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
  } catch(error) {
    next(new Error(error));
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id });
    res.render('shop/orders', {
      pageTitle: 'Orders',
      orders
    });
  } catch(error) {
    next(new Error(error));
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order || !order.user.userId.equals(req.user._id)) {
      throw 'Can`t get Invoice!';
    }
    res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
    const invoiceName = `invoice-${orderId}.pdf`;
    const filePath = path.join('data', 'invoices', invoiceName);
    fs.access(filePath, fs.constants.F_OK, async (err) => {
      if (err) {
        const pdfStream = await createPDFStream(order);
        pdfStream.pipe(fs.createWriteStream(filePath));
        pdfStream.pipe(res);
      } else {
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      }
    });
  } catch (error) {
    next(new Error(error));
  }
};

module.exports = {
  getProducts,
  getProduct,
  addToCart,
  getCart,
  deleteCartItem,
  makeOrder,
  getOrders,
  getInvoice
};

