const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.MAIL_API_KEY);

const signUpEmail = async (email) => {
  const msg = {
    to: email,
    from: 'berezdecky98@gmail.com',
    subject: 'Hi, you was successfully registered',
    text: 'Welcome to My Shop',
    html: '<strong>Welcome to My Shop</strong>',
  };
  try {
    await sgMail.send(msg);
  } catch(e) {
    console.log(e);
  }
};

const resetPswEmail = async (email, token) => {
  const msg = {
    to: email,
    from: 'berezdecky98@gmail.com',
    subject: 'Password changing',
    text: 'You wanna change your password',
    html: `
      <p>Here you can change your password</p>
      <a href="http://localhost:3300/newPassword?token=${token}">Click here to change your password</a>
    `,
  };
  try {
    await sgMail.send(msg);
  } catch(e) {
    console.log(e);
  }
};

module.exports = {
  signUpEmail,
  resetPswEmail
};