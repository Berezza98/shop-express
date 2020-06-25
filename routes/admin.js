const express = require('express');

const { getAddProduct, createProduct } = require('../controllers/products');

const router = express.Router();

router.get('/', getAddProduct);

router.post('/add-product', createProduct);

module.exports = router;