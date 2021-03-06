const nodemailer = require("nodemailer");

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
      <a href="http://myapi.date/newPassword?token=${token}">Click here to change your password</a>
    `,
  };
  try {
    const res = await transporter.sendMail(msg);
    console.log(res);
  } catch(e) {
    console.log(e);
  }
};

module.exports = {
  signUpEmail,
  resetPswEmail
};