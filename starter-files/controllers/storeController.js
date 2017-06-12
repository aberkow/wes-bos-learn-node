const mongoose = require('mongoose');
// reference the Schema from the mongoose variable. this takes advantage of the mongoose singelton concept.
const Store = mongoose.model('Store');
const jimp = require('jimp');
const uuid = require('uuid');
const multer = require('multer');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter: function(req, file, next) {
    const ifPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That file type is not allowed.'}, false);
    }
  }
};



exports.homePage = (req, res) => {
  console.log(req.name);
  // flash() takes two arguments. the type and the content to render out.
  // req.flash('error', 'Something bad happened');
  // req.flash('info', 'Something happened');
  // req.flash('warning', 'Something questionable happened');
  // req.flash('success', 'Something good happened');
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', {
    title: 'Add Store'
  });
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check i fthere is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  } 
  console.log(req.file);
}

// to catch errors, wrap createStore in another function. see errorHandlers.js.

// when the function is marked async node/browser knows that there will be async await code.
exports.createStore = async (req, res) => {
  //res.json(req.body); // req.body contains all the information taht was sent.
  // the slug is auto generated so you have to await the result of saving the store.
  const store = await (new Store(req.body)).save();
  await store.save() // saves data to db. or throws an error.
  req.flash('sucess', `Successfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
  // 1 - query the db for a list of stores.
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
}

exports.editStore = async (req, res) => {
  // Find the store given an id
  const store = await Store.findOne({ _id: req.params.id });

  // Confirm the person is the store owner

  // Render out edit form so user can update.
  res.render('editStore', { title: `Edit ${store.name}`, store });
}

exports.updateStore = async (req, res) => {
  // set the location data to be a point even if the address is changed/updated.
  req.body.location.type = 'Point';
  // find/update store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, { 
    new: true, // find the new store instead of the old one
    runValidators: true 
  }).exec(); // run the query

  // redirect to store
  req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`);
  res.redirect(`/stores/${store._id}/edit`);
}