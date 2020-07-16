const { Router } = require('express');

const isAuth = require('../middlewares/isAuth');

const {
  getProducts,
  getProduct,
  addToCart,
  getCart,
  deleteCartItem,
  makeOrder,
  getOrders
} = require('../controllers/products');

const router = Router();

router.get('/', getProducts);
router.get('/product/:productId', getProduct);
router.get('/cart', isAuth, getCart);
router.get('/orders', isAuth, getOrders);

router.post('/addToCart', isAuth, addToCart);
router.post('/deleteCartItem', isAuth, deleteCartItem);
router.post('/order', isAuth, makeOrder);

module.exports = router;