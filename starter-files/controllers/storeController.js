const mongoose = require('mongoose');
// reference the Schema from the mongoose variable. this takes advantage of the mongoose singelton concept.
const Store = mongoose.model('Store');

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