const { Router } = require('express');
const { body } = require('express-validator');
const passport = require('passport');

const User = require('../models/User');

const {
  getLogin,
  postLogin,
  getLogout,
  getSignUp,
  postSignUp,
  getResetPsw,
  postResetPsw,
  getNewPassword,
  postNewPassword,
  getLoginGoogleRedirect
} = require('../controllers/auth');

const router = Router();

router.get('/login', getLogin);
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/login/google/redirect', passport.authenticate('google', { failureRedirect: '/login' }), getLoginGoogleRedirect);
router.get('/logout', getLogout);
router.get('/signup', getSignUp);
router.get('/reset', getResetPsw);
router.get('/newPassword', getNewPassword);

router.post('/login',
[
  body('email', 'Please enter a valid email').isEmail()
],
postLogin);
router.post('/signup',
  [
    body('email', 'Please enter a valid email').isEmail().custom(async (value) => {
      const existedUser = await User.findOne({ email: value });
      if (existedUser) {
        return Promise.reject('User is already exist!');
      }
    }).normalizeEmail(),
    body('password', 'Password must include more than 6 symbols').isLength({ min: 6 }).trim(),
    body('confirmPassword').trim().custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords must be the same !');
      }
      return true;
    })
  ],
  postSignUp
);
router.post('/reset', postResetPsw);
router.post('/newPassword', postNewPassword);


module.exports = router;