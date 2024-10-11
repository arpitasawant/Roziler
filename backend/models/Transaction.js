const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date
});

module.exports = mongoose.model('Transaction', transactionSchema);
