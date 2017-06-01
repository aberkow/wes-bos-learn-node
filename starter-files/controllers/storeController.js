const mongoose = require('mongoose');
// reference the Schema from the mongoose variable. this takes advantage of the mongoose singelton concept.
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  console.log(req.name);
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
  const store = new Store(req.body);
  await store.save() // saves data to db. or throws an error.
  res.redirect('/');
}