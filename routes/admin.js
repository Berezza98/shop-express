const { Router } = require('express');

const isAuth = require('../middlewares/isAuth');

const {
  getAddProduct,
  createProduct,
  getAllProducts,
  getEditProduct,
  editProduct,
  deleteProduct
} = require('../controllers/admin');

const router = Router();

router.get('/', isAuth, getAllProducts);
router.get('/add-product', isAuth, getAddProduct);
router.get('/product/edit/:id', isAuth, getEditProduct);

router.post('/add-product', isAuth, createProduct);
router.post('/product/edit', isAuth, editProduct);
router.post('/product/delete', isAuth, deleteProduct);

module.exports = router;