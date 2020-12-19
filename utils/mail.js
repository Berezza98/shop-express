const { promisify } = require('util');
const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAIL_API_KEY);

const transporter = nodemailer.createTransport({
  host: "nw68.fcomet.com",
  port: 465,
  secure: true,
  auth: {
    user: 'admin@myapi.date',
    pass: process.env.MAIL_API_KEY,
  },
});

const signUpEmail = async (email) => {
  const msg = {
    to: email,
    from: 'admin@myapi.date',
    subject: 'Hi, you was successfully registered',
    text: 'Welcome to My Shop',
    html: '<strong>Welcome to My Shop</strong>',
  };
  try {
    //await sgMail.send(msg);
    await transporter.sendMail(msg);
  } catch(e) {
    console.log(e);
  }
};

const resetPswEmail = async (email, token) => {
  const msg = {
    to: email,
    from: 'admin@myapi.date',
    subject: 'Password changing',
    text: 'You wanna change your password',
    html: `
      <p>Here you can change your password</p>
      <a href="http://localhost:3300/newPassword?token=${token}">Click here to change your password</a>
    `,
  };
  try {
    //await sgMail.send(msg);
    await transporter.sendMail(msg);
  } catch(e) {
    console.log(e);
  }
};

module.exports = {
  signUpEmail,
  resetPswEmail
};