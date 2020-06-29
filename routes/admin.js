const express = require('express');

const {
  getAddProduct,
  createProduct,
  getAllProducts,
  getEditProduct,
  editProduct,
  deleteProduct
} = require('../controllers/admin');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/add-product', getAddProduct);
router.get('/product/edit/:id', getEditProduct);

router.post('/add-product', createProduct);
router.post('/product/edit', editProduct);
router.post('/product/delete', deleteProduct);

module.exports = router;