const get404 = (req, res) => {
  res.status(404).render('errors/404', {
    pageTitle: '404'
  });
};

const get500 = (error, req, res, next) => {
  res.status(500).render('errors/500', {
    pageTitle: '500'
  });
};

module.exports = {
  get404,
  get500
};