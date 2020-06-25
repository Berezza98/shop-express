const db = require('../utils/db');

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const { title, price, description, imageUrl } = this;
    return db.execute(
      'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
      [title, price, description, imageUrl]);
  }

  static async fetchAllProducts() {
    try {
      const data = await db.execute('SELECT * FROM products');
      return data;
    } catch(e) {
      console.log(e);
      return null;
    }
  }

  static async findById(id) {
    try {
      const [products, rows] = await db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
      return [products[0], rows];
    } catch(e) {
      console.log(e);
      return null;
    }
  }
}

module.exports = Product;