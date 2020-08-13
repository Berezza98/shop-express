const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = model('Product', productSchema);

// const { ObjectId } = require('mongodb');
// const { getDb } = require('../utils/db');

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new ObjectId(id) : undefined;
//     this.userId = userId;
//   }

//   async save() {
//     const db = getDb();
//     if (this._id) {
//       return await db.collection('products').updateOne({ _id: this._id }, { $set: this });
//     } else {
//       return await db.collection('products').insertOne(this);
//     }
//   }

//   static async deleteById(id) {
//     const db = getDb();
//     return await db.collection('products').deleteOne({ _id: new ObjectId(id) });
//   }

//   static async fetchAll() {
//     const db = getDb();
//     return await db.collection('products').find().toArray();
//   }

//   static async findById(id) {
//     const db = getDb();
//     return await db.collection('products').findOne({ _id: new ObjectId(id) });
//   }
// }

// module.exports = Product;