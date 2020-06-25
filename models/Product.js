const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const { rootDir } = require('../utils/path');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const modelPath = path.join(rootDir, 'data', 'products.json')

class Product {
  constructor(name) {
    this.name = name;
    this.id = Math.random().toFixed(16).toString();
  }

  static async save(product) {
    const currentProducts = await Product.fetchAllProducts();
    currentProducts.push(product);
    await writeFileAsync(modelPath, JSON.stringify(currentProducts));
  }

  static async fetchAllProducts() {
    let products = [];
    try {
      const data = await readFileAsync(modelPath);
      products = JSON.parse(data);
    } catch(e) {
      console.log(e);
    }
    return products;
  }
}

module.exports = Product;