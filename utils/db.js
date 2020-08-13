const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async () => {
  try {
    const client = await MongoClient.connect('mongodb+srv://roman:Berezza98@cluster0-f6ftl.mongodb.net/shop?retryWrites=true&w=majority');
    _db = client.db();
  } catch(e) {
    throw e;
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No BD found!';
};

module.exports = {
  mongoConnect,
  getDb
};