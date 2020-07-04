const express = require('express');

const {
  getProducts,
  getProduct,
  addToCart,
  getCart,
  deleteCartItem,
  makeOrder,
  getOrders
} = require('../controllers/products');

const router = express.Router();

router.get('/', getProducts);
router.get('/product/:productId', getProduct);
router.get('/cart', getCart);
router.get('/orders', getOrders);

router.post('/addToCart', addToCart);
router.post('/deleteCartItem', deleteCartItem);
router.post('/order', makeOrder);

module.exports = router;