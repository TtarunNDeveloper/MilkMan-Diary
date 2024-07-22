const mongoose = require('mongoose');

const distributorSchema = new mongoose.Schema({
  distr_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  }
});

const Distributor = mongoose.model('Distributor', distributorSchema);

module.exports = Distributor;
