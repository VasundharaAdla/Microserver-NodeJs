const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  createdBy: {
    type: String,
    required: [true, 'createdBy (userId) is required'],
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

productSchema.virtual('id').get(function () {
  return this._id.toString();
});

module.exports = mongoose.model('Product', productSchema);
