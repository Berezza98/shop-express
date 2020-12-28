const { Router } = require('express');

const isAuth = require('../middlewares/isAuth');

const {
  getProducts,
  getProduct,
  addToCart,
  getCheckout,
  getCart,
  deleteCartItem,
  makeOrder,
  getOrders,
  getInvoice
} = require('../controllers/products');

const router = Router();

router.get('/', getProducts);
router.get('/product/:productId', getProduct);
router.get('/checkout', isAuth, getCheckout);
router.get('/checkout/success', isAuth, makeOrder);
router.get('/checkout/cancel', isAuth, getCheckout);
router.get('/cart', isAuth, getCart);
router.get('/orders', isAuth, getOrders);
router.get('/invoice/:orderId', isAuth, getInvoice);

router.post('/addToCart', isAuth, addToCart);
router.post('/deleteCartItem', isAuth, deleteCartItem);

module.exports = router;