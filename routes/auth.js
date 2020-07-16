const { Router } = require('express');

const {
  getLogin,
  postLogin,
  getLogout,
  getSignUp,
  postSignUp,
  getResetPsw,
  postResetPsw,
  getNewPassword,
  postNewPassword
} = require('../controllers/auth');

const router = Router();

router.get('/login', getLogin);
router.get('/logout', getLogout);
router.get('/signup', getSignUp);
router.get('/reset', getResetPsw);
router.get('/newPassword', getNewPassword);

router.post('/login', postLogin);
router.post('/signup', postSignUp);
router.post('/reset', postResetPsw);
router.post('/newPassword', postNewPassword);


module.exports = router;