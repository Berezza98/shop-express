const { getDb } = require('../utils/db');
const { ObjectId } = require('mongodb');

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // { items: [ { productId, quantity } ] }
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  static findById(id) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new ObjectId(id) });
  }

  addToCart(product) {
    const db = getDb();
    const prodId = product._id;
    const neededCartItem = this.cart.items.find(item => item.productId.equals(prodId));
    if (neededCartItem) {
      neededCartItem.quantity++;
    } else {
      this.cart.items.push({ productId: new ObjectId(prodId), quantity: 1 })
    }
    return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: this.cart.items } } });
  }

  async getCart() {
    const productsId = this.cart.items.map(({ productId }) => productId);
    const db = getDb();
    const prods = await  db.collection('products').find({ _id: { $in: productsId } }).toArray();
    return prods.map(prod => ({
      ...prod,
      quantity: this.cart.items.find(item => item.productId.equals(prod._id)).quantity
    }));
  }

  deleteFormCart(id) {
    const db = getDb();
    const neededCartItem = this.cart.items.find(item => item.productId.equals(id));
    if (neededCartItem.quantity > 1) {
      neededCartItem.quantity--;
    } else {
      this.cart.items = this.cart.items.filter(item => item !== neededCartItem);
    }
    return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: this.cart } });
  }

  async makeOrder() {
    const db = getDb();
    const products = await this.getCart();
    const order = {
      items: products,
      user: {
        _id: new ObjectId(this._id),
        name: this.name,
        email: this.email
      }
    };
    await db.collection('orders').insertOne(order);
    this.cart = { items: [] };
    db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: this.cart.items } } });
  }

  async getOrders() {
    const db = getDb();
    return await db.collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray();
  }
}

module.exports = User;