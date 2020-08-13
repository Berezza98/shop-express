const path = require('path');

const ejs = require('ejs');
const pdf = require('html-pdf');

const createPDFStream = async (data) => {
  try {
    const html = await ejs.renderFile(path.join(__dirname, 'template', 'index.ejs'), data);
    return new Promise((resolve, reject) => {
      pdf.create(html).toStream((err, stream) => {
        if (err) {
          reject(err);
        }
        resolve(stream);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = createPDFStream;