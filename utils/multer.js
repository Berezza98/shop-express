const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (allowMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  }
  cb(null, false);
};

module.exports = {
  storage,
  fileFilter
};