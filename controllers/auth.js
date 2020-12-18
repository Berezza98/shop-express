const crypto = require('crypto');
const { promisify } = require('util');

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/User');
const { signUpEmail, resetPswEmail } = require('../utils/mail');

const asyncRandomBytes = promisify(crypto.randomBytes);

const getLogin = (req, res) => {
  const [error] = req.flash('error');
  res.render('auth/index', {
    pageTitle: 'Log In',
    error,
    input: {
      email: ''
    }
  });
};

const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/index', {
        pageTitle: 'Log In',
        error: errors.array()[0].msg,
        input: {
          email
        }
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'User is not correct!');
      res.redirect('/login');
    }
  
    const correctPassword = await bcrypt.compare(password, user.password);
    if (correctPassword) {
      req.session.loggedIn = true;
      req.session.user = user;
      req.session.save(() => { // wait for Mongo will save all data in DB
        res.redirect('/');
      });
    } else {
      req.flash('error', 'Password is not correct!');
      res.redirect('/login');
    }
  } catch(error) {
    next(new Error(error));
  }
};

const getLogout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

const getSignUp = async (req, res) => {
  const [error] = req.flash('error');
  res.render('auth/signup', {
    pageTitle: 'Sign Up',
    loggedIn: false,
    error,
    input: {
      email: '',
      password: ''
    }
  });
};

const postSignUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signUp', {
        pageTitle: 'Sign Up',
        loggedIn: false,
        error: errors.array()[0].msg,
        input: {
          email,
          password
        }
      });
    }
  
    const hashedPsw = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPsw,
      cart: {
        items: []
      }
    });
    await user.save();
    signUpEmail(email);
    res.redirect('/login');
  } catch(error) {
    next(new Error(error));
  }
};

const getResetPsw = (req, res) => {
  const [error] = req.flash('error');
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    error
  });
};

const postResetPsw = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const neededUser = await User.findOne({ email });
    if (!neededUser) {
      req.flash('error', 'User is not exist!');
      return res.redirect('/reset');
    }
    const buffer = await asyncRandomBytes(32);
    const token = buffer.toString('hex');
    neededUser.resetToken = token;
    neededUser.resetTokenExpiration = Date.now() + (1000 * 60 * 60); // one hour
    await neededUser.save();
    resetPswEmail(email, token);
    res.redirect('/');
  } catch(error) {
    next(new Error(error));
  }
};

const getNewPassword = async (req, res, next) => {
  try {
    const [error] = req.flash('error');
    const { token } = req.query;
  
    const neededUser = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!neededUser) {
      return res.render('auth/newPassword', {
        pageTitle: 'Change Password',
        error: 'Please make new request for changing your password',
        hideForm: true
      });
    }
  
    res.render('auth/newPassword', {
      pageTitle: 'Change Password',
      error,
      token,
      hideForm: false
    });
  } catch(error) {
    next(new Error(error));
  }
};

const postNewPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword, token } = req.body;
  
    if (password !== confirmPassword) {
      req.flash('error', 'Confirm password is not the same as password, please try again!');
      return res.redirect(`/newPassword?token=${token}`);
    }
    const neededUser = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    const hashedPsw = await bcrypt.hash(password, 12);
    neededUser.password = hashedPsw;
    neededUser.resetToken = undefined;
    neededUser.resetTokenExpiration = undefined;
    await neededUser.save();
    res.redirect('/login');
  } catch(error) {
    next(new Error(error));
  }
};

const getLoginGoogleRedirect = (req, res) => {
  res.send('Hello');
};

module.exports = {
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
};