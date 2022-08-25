var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("shopzilla");
  
  dbo.createCollection("cart", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    // db.close();
  });

  dbo.createCollection("register", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    // db.close();
  });

  dbo.createCollection("categories", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    // db.close();
  });

  dbo.createCollection("admin_master", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    // db.close();
  });

  dbo.createCollection("sub_categories", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    // db.close();
  });

  dbo.createCollection("products", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    // db.close();
  });

   dbo.createCollection("blog", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    // db.close();
  });

  dbo.createCollection("contact", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    // db.close();
  });

  dbo.createCollection("purchased_products", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");
    // db.close();
  });

});
