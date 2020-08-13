const { Router } = require('express');

const { get404 } = require('../controllers/errors');

const router = Router();

router.use(get404);

module.exports = router;