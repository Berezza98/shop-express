const { model, Schema } = require('mongoose');

const orderSchema = new Schema({
  user: {
    email: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  products: [
    {
      quantity: {
        type: Number,
        required: true
      },
      product: {
        type: Object,
        required: true
      }
    }
  ]
});

module.exports = model('Order', orderSchema);