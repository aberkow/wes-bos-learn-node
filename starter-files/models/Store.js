const mongoose = require('mongoose');

// Use the global promise to wait for data. This is a built in ES6 Promise
mongoose.Promise = global.Promise;

const slug = require('slugs');

// do as much data validation/normalization as close to the model as possible.
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String] // an array of strings.
});

// create a slug based on the name before the db entry is saved.
storeSchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    next(); // skip it.
    return;
  }
  this.slug = slug(this.name);
  next();

  // TODO make slugs unique in the future.
})

module.exports = mongoose.model('Store', storeSchema);