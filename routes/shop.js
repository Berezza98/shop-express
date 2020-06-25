const express = require('express');

const { getProducts, getProduct } = require('../controllers/products');

const router = express.Router();

router.get('/', getProducts);

router.get('/product/:productId', getProduct)

module.exports = router;