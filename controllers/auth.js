const crypto = require('crypto');
const { promisify } = require('util');

const bcrypt = require('bcryptjs');

const User = require('../models/User');
const { signUpEmail, resetPswEmail } = require('../utils/mail');

const asyncRandomBytes = promisify(crypto.randomBytes);

const getLogin = (req, res) => {
  const [error] = req.flash('error');
  res.render('auth/index', {
    pageTitle: 'Log In',
    error
  });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
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
};

const getLogout = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

const getSignUp = async (req, res) => {
  const [error] = req.flash('error');
  res.render('auth/signUp', {
    pageTitle: 'Sign Up',
    loggedIn: false,
    error
  });
};

const postSignUp = async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    req.flash('error', 'User is already exist!');
    return res.redirect('/signup');
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
};

const getResetPsw = (req, res) => {
  const [error] = req.flash('error');
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    error
  });
};

const postResetPsw = async (req, res) => {
  const { email } = req.body;
  
  const neededUser = await User.findOne({ email });
  if (!neededUser) {
    req.flash('error', 'User is not exist!');
    return res.redirect('/reset');
  }
  try {
    const buffer = await asyncRandomBytes(32);
    const token = buffer.toString('hex');
    neededUser.resetToken = token;
    neededUser.resetTokenExpiration = Date.now() + (1000 * 60 * 60); // one hour
    await neededUser.save();
    resetPswEmail(email, token);
    res.redirect('/');
  } catch(e) {
    console.log(e);
    return res.redirect('/reset');
  }
};

const getNewPassword = async (req, res) => {
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
};

const postNewPassword = async (req, res) => {
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
  postNewPassword
};