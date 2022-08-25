var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

var express = require("express");
var session = require("express-session");
var MongoStore = require("connect-mongo");
var path = require("path");
var MemoryStore = require("memorystore")(session);
const app = express();
var router = express.Router();

const port = 3000;
// app.use(session({secret: 'uitisawesome'}));
// app.use(session({secret: 'app-secret', cookie:{maxAge:60000000}}));
// app.use(session({

//     secret  : "Stays my secret",
//     cookie: { maxAge: 8*60*60*1000 },
//     // maxAge  : new Date(Date.now() + 36000000000), //1 Hour
//     store: new MemoryStore({
//       checkPeriod: 8*60*60*1000 // prune expired entries every 24h
//     }),
//     expires : new Date(Date.now() + 36000000000)
// }));

// const app = express()
app.use(
  session({
    secret: "Stays my secret",
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// app.use(morgan('combined'))
// app.use(cors({
//     credentials: true
// }));

// app.use(session(
//     { secret: "secret", store: new MemoryStore(), maxAge: Date.now() + (30 * 86400 * 1000)
//     }));
bodyParser = require("body-parser");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.urlencoded({ limit: "50mb" }));

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// Routes starts
app.get("/", (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "public", "web/web_index.html"));
});

app.get("/index", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin_master", (req, res) => {
  // if(req.session.email) {
  res
    .status(200)
    .sendFile(path.join(__dirname, "public", "admin/admin_master.html"));
  // }
});

app.get("/categories", (req, res) => {
  if (req.session.email) {
    res
      .status(200)
      .sendFile(path.join(__dirname, "public", "vendor/categories.html"));
  }
});

app.get("/sub_categories", (req, res) => {
  if (req.session.email) {
    res
      .status(200)
      .sendFile(path.join(__dirname, "public", "vendor/sub_categories.html"));
  }
});

app.get("/product", (req, res) => {
  if (req.session.email) {
    res
      .status(200)
      .sendFile(path.join(__dirname, "public", "vendor/product.html"));
  }
});

app.get("/blog", (req, res) => {
  if (req.session.email) {
    res.status(200).sendFile(path.join(__dirname, "public", "admin/blog.html"));
  }
});

app.get("/order", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "vendor/order.html"));
});

app.get("/contact_details", (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "public", "admin/contact_details.html"));
});

app.post("/login", function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    db.collection("admin_master").findOne(
      { ad_email: req.body.txtEmail, ad_password: req.body.txtPassword },
      function (err, user) {
        if (err) {
          console.log(err);
        }
        var message;
        if (user) {
          req.session.email = req.body.txtEmail;

          db.collection("admin_master")
            .find({ ad_email: req.body.txtEmail })
            .toArray(function (err, result) {
              var lclRole = JSON.stringify(result);
              var lclRole1 = JSON.parse(lclRole);
              req.session.role = lclRole1[0].ad_role;
              req.session.name = lclRole1[0].ad_name;
              req.session.email = lclRole1[0].ad_email;
              res.end(JSON.stringify(req.session.role));
            });
        } else {
          res.end(JSON.stringify("user does not exist"));
        }
        // res.json({message: message});
      }
    );
  });
});

// admin CRUD starts
app.post("/get_data/admin/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("admin_master")
      .find({ ad_status: "0" })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/insert_post_admin", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var lclCount = 0;

    db.collection("admin_master")
      .find()
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        // res.end(JSON.stringify(result.length));
        lclCount = result.length + 1;
        var documentReq = {
          ad_id: lclCount,
          ad_name: req.body.txtName,
          ad_email: req.body.txtEmail,
          ad_mobile: req.body.txtMobileNo,
          ad_password: req.body.txtPassword,
          ad_role: req.body.selRole,
          ad_user_email: req.session.email,
          ad_status: "0",
        };
        db.collection("admin_master").insertMany(
          [documentReq],
          function (err, result) {
            res.end(JSON.stringify("1"));
          }
        );
      });
  });
});

app.post("/update_post_admin", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var myquery = { ad_id: parseInt(req.body.id) };
    var newvalues = {
      $set: {
        ad_name: req.body.txtName,
        ad_email: req.body.txtEmail,
        ad_mobile: req.body.txtMobileNo,
        ad_role: req.body.selRole,
      },
    };
    // console.log(req.body.id);
    db.collection("admin_master").updateOne(
      myquery,
      newvalues,
      function (err, result) {
        // res.end(JSON.stringify(res));
        if (err) throw err;
        res.end(JSON.stringify("1"));
      }
    );
  });
});

app.post("/delete_post_admin", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var myquery = { ad_id: parseInt(req.body.id) };
    var newvalues = { $set: { ad_status: "1" } };
    db.collection("admin_master").updateOne(
      myquery,
      newvalues,
      function (err, result) {
        if (err) throw err;
        console.log("1 document deleted");
        // db.close();
        res.end(JSON.stringify("1"));
      }
    );
  });
});
// admin CRUD operation ends

// Category CRUD starts
app.post("/get_data/category/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("categories")
      .find({ ca_status: "0" })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/insert_post_category", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var lclCount = 0;

    db.collection("categories")
      .find()
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        // res.end(JSON.stringify(result.length));
        lclCount = result.length + 1;
        var documentReq = {
          ca_id: lclCount,
          ca_name: req.body.txtName,
          ca_user_email: req.session.email,
          ca_status: "0",
        };
        db.collection("categories").insertMany(
          [documentReq],
          function (err, result) {
            res.end(JSON.stringify("1"));
          }
        );
      });
  });
});

app.post("/update_post_category", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var myquery = { ca_id: parseInt(req.body.id) };
    var newvalues = {
      $set: {
        ca_name: req.body.txtName,
      },
    };
    // console.log(req.body.id);
    db.collection("categories").updateOne(
      myquery,
      newvalues,
      function (err, result) {
        // res.end(JSON.stringify(res));
        if (err) throw err;
        res.end(JSON.stringify("1"));
      }
    );
  });
});

app.post("/delete_post_category", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var myquery = { ca_id: parseInt(req.body.id) };
    var newvalues = { $set: { ca_status: "1" } };
    db.collection("categories").updateOne(
      myquery,
      newvalues,
      function (err, result) {
        if (err) throw err;
        console.log("1 document deleted");
        // db.close();
        res.end(JSON.stringify("1"));
      }
    );
  });
});
// Category CRUD operation ends

// Sub Category CRUD starts
app.post("/get_data/sub_category/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("sub_categories")
      .find({ sc_status: "0" })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/insert_post_sub_category", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var lclCount = 0;

    db.collection("sub_categories")
      .find()
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        // res.end(JSON.stringify(result.length));
        lclCount = result.length + 1;
        var documentReq = {
          sc_id: lclCount,
          sc_category_name: req.body.selCategory,
          sc_name: req.body.txtName,
          sc_user_email: req.session.email,
          sc_status: "0",
        };
        db.collection("sub_categories").insertMany(
          [documentReq],
          function (err, result) {
            res.end(JSON.stringify("1"));
          }
        );
      });
  });
});

app.post("/update_post_sub_category", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var myquery = { sc_id: parseInt(req.body.id) };
    var newvalues = {
      $set: {
        sc_category_name: req.body.selCategory,
        sc_name: req.body.txtName,
      },
    };
    // console.log(req.body.id);
    db.collection("sub_categories").updateOne(
      myquery,
      newvalues,
      function (err, result) {
        // res.end(JSON.stringify(res));
        if (err) throw err;
        res.end(JSON.stringify("1"));
      }
    );
  });
});

app.post("/delete_post_sub_category", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var myquery = { sc_id: parseInt(req.body.id) };
    var newvalues = { $set: { sc_status: "1" } };
    db.collection("sub_categories").updateOne(
      myquery,
      newvalues,
      function (err, result) {
        if (err) throw err;
        console.log("1 document deleted");
        // db.close();
        res.end(JSON.stringify("1"));
      }
    );
  });
});
// Sub Category CRUD operation ends

app.post("/get_sub_category/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("sub_categories")
      .find({ sc_status: "0", sc_category_name: req.body.selCategory })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/get_sub_category1/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("sub_categories")
      .find({ sc_status: "0", sc_category_name: req.body.selCategory1 })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/get_nav_details/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("sub_categories")
      .find({ sc_status: "0" })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

// Sub Category CRUD starts
app.post("/get_data/product/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("products")
      .find({ pd_status: "0" })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/insert_post_product", urlencodedParser, function (req, res) {
  // req.session.email = req.body.txtName;
  // console.log(req.session.email);

  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var lclCount = 0;

    db.collection("products")
      .find()
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        // res.end(JSON.stringify(result.length));
        lclCount = result.length + 1;

        var base64Data = req.body.txtImage.replace(
          /^data:image\/\w+;base64,/,
          ""
        );

        require("fs").writeFile(
          "public/products/images/product/" + lclCount + ".png",
          base64Data,
          "base64",
          function (err) {
            var lclImagePath =
              "public/products/images/product/" + lclCount + ".png";

            var documentReq = {
              pd_id: lclCount,
              pd_category: req.body.selCategory,
              pd_sub_category: req.body.selSubCategory,
              pd_name: req.body.txtName,
              pd_image: lclImagePath,
              pd_price: req.body.txtPrice,
              pd_qty: req.body.txtQTY,
              pd_description: req.body.txtDescription,
              pd_user_name: req.session.name,
              pd_user_email: req.session.email,
              pd_status: "0",
            };
            db.collection("products").insertMany(
              [documentReq],
              function (err, result) {
                res.end(JSON.stringify("1"));
              }
            );
          }
        );
      });
  });
});

app.post("/update_post_product", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var myquery = { pd_id: parseInt(req.body.id) };

    if (req.body.txtImageURL1 == "") {
      var base64Data = req.body.txtImage.replace(
        /^data:image\/\w+;base64,/,
        ""
      );

      require("fs").writeFile(
        "public/products/images/product/" + req.body.id + ".png",
        base64Data,
        "base64",
        function (err) {
          var lclImagePath =
            "public/products/images/product/" + req.body.id + ".png";

          var newvalues = {
            $set: {
              pd_category: req.body.selCategory,
              pd_sub_category: req.body.selSubCategory,
              pd_name: req.body.txtName,
              pd_image: lclImagePath,
              pd_price: req.body.txtPrice,
              pd_qty: req.body.txtQTY,
              pd_description: req.body.txtDescription,
            },
          };
          // console.log(req.body.id);
          db.collection("products").updateOne(
            myquery,
            newvalues,
            function (err, result) {
              // if (err) throw err;
              res.end(JSON.stringify("1"));
            }
          );
        }
      );
    } else {
      var newvalues = {
        $set: {
          pd_category: req.body.selCategory,
          pd_sub_category: req.body.selSubCategory,
          pd_name: req.body.txtName,
          pd_image: lclImagePath,
          pd_price: req.body.txtPrice,
          pd_qty: req.body.txtQTY,
          pd_description: req.body.txtDescription,
        },
      };
      // console.log(req.body.id);
      db.collection("products").updateOne(
        myquery,
        newvalues,
        function (err, result) {
          if (err) throw err;
          res.end(JSON.stringify("1"));
        }
      );
      // res.end(JSON.stringify("1"));
    }
  });
});

app.post("/delete_post_product", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var myquery = { pd_id: parseInt(req.body.id) };
    var newvalues = { $set: { pd_status: "1" } };
    db.collection("products").updateOne(
      myquery,
      newvalues,
      function (err, result) {
        if (err) throw err;
        console.log("1 document deleted");
        // db.close();
        res.end(JSON.stringify("1"));
      }
    );
  });
});
// Sub Category CRUD operation ends

// Blog crud operation starts

app.post("/insert_post_blog", urlencodedParser, function (req, res) {
  // req.session.email = req.body.txtName;
  // console.log(req.session.email);

  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var lclCount = 0;

    db.collection("blog")
      .find()
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        // res.end(JSON.stringify(result.length));
        lclCount = result.length + 1;

        var base64Data = req.body.txtImage.replace(
          /^data:image\/\w+;base64,/,
          ""
        );

        require("fs").writeFile(
          "public/products/images/blog/" + lclCount + ".png",
          base64Data,
          "base64",
          function (err) {
            var lclImagePath =
              "public/products/images/blog/" + lclCount + ".png";

            var documentReq = {
              bl_id: lclCount,
              bl_image: lclImagePath,
              bl_title: req.body.txtTitle,
              bl_content: req.body.txtContent,
              bl_date: req.body.txtDate,
              bl_user_name: req.session.name,
              bl_user_email: req.session.email,
              bl_status: "0",
            };
            db.collection("blog").insertMany(
              [documentReq],
              function (err, result) {
                res.end(JSON.stringify("1"));
              }
            );
          }
        );
      });
  });
});
app.post("/get_data/blog/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("blog")
      .find({ bl_status: "0" })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/delete_post_blog", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var myquery = { bl_id: parseInt(req.body.id) };
    var newvalues = { $set: { bl_status: "1" } };
    db.collection("blog").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      console.log("1 document deleted");
      // db.close();
      res.end(JSON.stringify("1"));
    });
  });
});
// Blog Crud operation ends
app.post("/get_blog_details/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("blog")
      .find({ bl_status: "0" })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/get_blog_single/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    // console.log(req.session.blog_id)

    db.collection("blog")
      .find({ bl_id: parseInt(req.session.blog_id) })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

// order code starts

app.post("/get_data/order_details", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    if (req.session.role == "Admin") {
      db.collection("order_details")
        .find({ or_status: "1" })
        .toArray(function (err, result) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        });
    } else {
      // db.collection("farmer_details").find({ ms_status: "0"}, {ms_user_email: req.session.email}).toArray(function(err, result) {
      db.collection("order_details")
        .find({
          $and: [{ or_status: "1" }, { or_created_by: req.session.email }],
        })
        .toArray(function (err, result) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        });
    }
  });
});

// order code ends

// ================================ Web Related Code starts =========================== //

app.get("/web_index", (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "public", "web/web_index.html"));
});

app.get("/web_blog", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "web/blog.html"));
});

app.get("/blog_single", (req, res) => {
  req.session.blog_id = req.query.id;
  res
    .status(200)
    .sendFile(path.join(__dirname, "public", "web/blog_single.html"));
});

app.get("/web_product", (req, res) => {
  req.session.cat_id = req.query.id;
  res
    .status(200)
    .sendFile(path.join(__dirname, "public", "web/web_product.html"));
});

app.get("/single_product_detail", (req, res) => {
  req.session.product_id = req.query.id;
  res
    .status(200)
    .sendFile(path.join(__dirname, "public", "web/single_product_detail.html"));
});

app.get("/register", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "web/register.html"));
});

app.get("/signin", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "public", "web/signin.html"));
});

app.get("/shop", (req, res) => {
  req.session.crops_id = req.query.q;
  res.status(200).sendFile(path.join(__dirname, "public", "web/shop.html"));
});

app.get("/search", (req, res) => {
  req.session.search = req.query.q;
  res.status(200).sendFile(path.join(__dirname, "public", "web/search.html"));
});

app.get("/cart", (req, res) => {
  req.session.product_id = req.query.id;
  res.status(200).sendFile(path.join(__dirname, "public", "web/cart.html"));
});

app.get("/checkout", (req, res) => {
  // req.session.product_id = req.query.id;
  res.status(200).sendFile(path.join(__dirname, "public", "web/checkout.html"));
});

app.get("/web_contact", (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "public", "web/web_contact.html"));
});

app.get("/user_order_details", (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "public", "web/user_order_details.html"));
});

app.get("/web_product_category", (req, res) => {
  req.session.category_id = req.query.id;

  res
    .status(200)
    .sendFile(path.join(__dirname, "public", "web/web_product_category.html"));
});

app.get("/logout", (req, res) => {
  // req.session.crops_id = req.query.id;
  res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/insert_post_contact", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var lclCount = 0;

    db.collection("contact")
      .find()
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        // res.end(JSON.stringify(result.length));
        lclCount = result.length + 1;
        var documentReq = {
          cn_id: lclCount,
          cn_name: req.body.txtName,
          cn_email: req.body.txtEmail,
          cn_subject: req.body.txtSubject,
          cn_message: req.body.txtMessage,
          cn_phone: req.body.txtPhone,
          cn_user_email: req.session.email,
          cn_status: "0",
        };
        db.collection("contact").insertMany(
          [documentReq],
          function (err, result) {
            res.end(JSON.stringify("1"));
          }
        );
      });
  });
});

app.post("/get_product_details/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    console.log(req.session.cat_id);

    db.collection("products")
      .find({ pd_status: "0", pd_sub_category: req.session.cat_id })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/get_user_order_details/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("purchased_products")
      .find({ pp_ordered_by: req.session.web_email })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.post(
  "/get_product_category_details/",
  urlencodedParser,
  function (req, res) {
    MongoClient.connect(url, function (err, db) {
      var db = db.db("shopzilla");
      // console.log(req.session.category_id)

      db.collection("products")
        .find({ pd_status: "0", pd_category: req.session.category_id })
        .toArray(function (err, result) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        });
    });
  }
);

app.post(
  "/get_product_sub_category_details/",
  urlencodedParser,
  function (req, res) {
    MongoClient.connect(url, function (err, db) {
      var db = db.db("shopzilla");

      console.log(req.session.category_id);

      db.collection("sub_categories ")
        .find({ pd_status: "0", pd_category: req.session.category_id })
        .toArray(function (err, result) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        });
    });
  }
);

app.post("/get_single_product_details/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    // console.log(req.session.product_id)

    db.collection("products")
      .find({ pd_status: "0", pd_id: parseInt(req.session.product_id) })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.get("/pay_success", (req, res) => {
  MongoClient.connect(url, function (err, db) {
    // console.log(req.query.transaction_id)
    // console.log(req.query.transaction_id)

    var db = db.db("shopzilla");
    var myquery = { or_ordered_by: req.query.email, or_status: "0" };
    var newvalues = {
      $set: {
        or_transaction_no: req.query.transaction_id,
        or_status: "1",
      },
    };

    db.collection("order_details").updateOne(
      myquery,
      newvalues,
      function (err, result) {
        if (err) throw err;
      }
    );

    var myquery = { ct_ordered_by: req.session.web_email, ct_status: "0" };
    var newvalues = {
      $set: {
        ct_status: "1",
      },
    };

    db.collection("cart").updateMany(
      myquery,
      newvalues,
      function (err, result) {
        if (err) throw err;
        // res.end(JSON.stringify("1"));
      }
    );
  });

  // res.status(200).sendFile(path.join(__dirname, "public", "web/pay_success.html"));
  res.redirect("web/pay_success.html");
});

app.post("/get_buy", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    db.collection("products")
      .find({ $and: [{ pd_id: parseInt(req.session.product_id) }] })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        // req.session.vendor_email = result[0].pd_user_email;
        // console.log(result[0].pd_user_email);
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/get_cart", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    console.log(req.session.web_email);
    var db = db.db("shopzilla");
    db.collection("cart")
      .find({
        $and: [{ ct_status: "0" }, { ct_ordered_by: req.session.web_email }],
      })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        // console.log(req.session.crops_id);
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/add_cart", urlencodedParser, function (req, res) {
  if (req.session.web_email) {
    MongoClient.connect(url, function (err, db) {
      // console.log(req.session.product_id);

      var db = db.db("shopzilla");
      var lclCount = 0;

      db.collection("products")
        .find({ pd_id: parseInt(req.session.product_id) })
        .toArray(function (err, result) {
          // res.writeHead(200, { 'Content-Type': 'application/json' });

          db.collection("cart")
            .find()
            .toArray(function (err, result1) {
              res.writeHead(200, { "Content-Type": "application/json" });
              // res.end(JSON.stringify(result.length));
              lclCount = result1.length + 1;

              // console.log(lclCount);
              var lclTotalAmt = parseInt(req.body.selQTY * result[0].pd_price);
              var documentReq = {
                ct_id: lclCount,
                ct_name: result[0].pd_name,
                ct_image: result[0].pd_image,
                ct_rate: result[0].pd_price,
                ct_qty: req.body.selQTY,
                ct_total_amt: lclTotalAmt,
                ct_ordered_by: req.session.web_email,
                ct_status: "0",
                ct_created_by: result[0].pd_user_email,
              };
              req.session.vendor_email = result[0].pd_user_email;
              // console.log(req.session.vendor_email);
              db.collection("cart").insertMany(
                [documentReq],
                function (err, result) {
                  res.end(JSON.stringify(1));
                }
              );
            });
        });
    });
  } else {
    res.end(JSON.stringify(10));
  }
});

app.post("/check_buy_login", urlencodedParser, function (req, res) {
  if (req.session.web_email) {
    res.end(JSON.stringify(parseInt(req.session.product_id)));
  } else {
    res.end(JSON.stringify(10));
  }
});

app.post("/checkout/payment", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    console.log(req.session.vendor_email);
    var db = db.db("shopzilla");
    var lclCount = 0;

    db.collection("order_details")
      .find()
      .toArray(function (err, result) {
        // res.writeHead(200, { 'Content-Type': 'application/json' });
        // res.end(JSON.stringify(result.length));
        lclCount = result.length + 1;
        var documentReq = {
          or_id: lclCount,
          or_name: req.body.txtName,
          or_email: req.body.txtEmail,
          or_mobile: req.body.txtMobileNo,
          or_address: req.body.txtAddress,
          or_amount: req.body.totalAmt,
          or_date: req.body.txtDate,
          or_ordered_by: req.session.web_email,
          or_created_by: req.session.vendor_email,
          or_transaction_no: req.body.transaction_id,
          or_status: "0",
        };
        db.collection("order_details").insertMany(
          [documentReq],
          function (err, result) {
            // res.end(JSON.stringify("1"));
          }
        );
      });

    db.collection("purchased_products")
      .find()
      .toArray(function (err, result1) {
        // res.writeHead(200, { 'Content-Type': 'application/json' });
        // res.end(JSON.stringify(result.length));

        lclProductName = req.body.productName.split("<>");
        lclProductQTY = req.body.productQTY.split("<>");
        lclProductPrice = req.body.productPrice.split("<>");
        lclProductTotal = req.body.productTotal.split("<>");
        // console.log(lclProductName[0]);

        for (
          let lclSplitValue = 0;
          lclSplitValue < lclProductName.length;
          lclSplitValue++
        ) {
          lclCount = result1.length + 1;
          var documentReq = {
            // pp_id: lclCount,
            pp_name: lclProductName[lclSplitValue],
            pp_qty: lclProductQTY[lclSplitValue],
            pp_price: lclProductPrice[lclSplitValue],
            pp_amount: lclProductTotal[lclSplitValue],
            pp_shipped_date: req.body.txtDateShipping,
            pp_ordered_by: req.session.web_email,
            pp_status: "0",
          };

          db.collection("purchased_products").insertMany(
            [documentReq],
            function (err, result) {}
          );
        }
      });

    res.end(JSON.stringify("1"));
  });
});

app.post("/add_register", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("register").findOne(
      { rd_email: req.body.txtEmail, rd_mobile: req.body.txtMobileNo },
      function (err, user) {
        if (err) {
          console.log(err);
        }
        var message;
        if (user) {
          req.session.web_email = req.body.txtEmail;
          res.end(JSON.stringify(10));
        } else {
          var lclCount = 0;

          db.collection("register")
            .find()
            .toArray(function (err, result) {
              res.writeHead(200, { "Content-Type": "application/json" });
              // res.end(JSON.stringify(result.length));
              lclCount = result.length + 1;
              var documentReq = {
                rd_id: lclCount,
                rd_name: req.body.txtName,
                rd_email: req.body.txtEmail,
                rd_mobile: req.body.txtMobileNo,
                rd_password: req.body.txtPassword,
                rd_status: "0",
              };
              db.collection("register").insertMany(
                [documentReq],
                function (err, result) {
                  res.end(JSON.stringify(1));
                }
              );
            });
        }
      }
    );
  });
});

app.post("/check_signin", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    db.collection("register").findOne(
      { rd_email: req.body.txtEmail, rd_password: req.body.txtPassword },
      function (err, user) {
        if (err) {
          console.log(err);
        }
        var message;
        if (user) {
          req.session.web_email = req.body.txtEmail;
          res.end(JSON.stringify(1));
        } else {
          res.end(JSON.stringify(10));
        }
      }
    );
  });
});

app.post("/cancel_item/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");
    var myquery = { ct_id: parseInt(req.body.id) };
    var newvalues = { $set: { ct_status: "1" } };
    db.collection("cart").updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      console.log("1 document deleted");
      // db.close();
      res.end(JSON.stringify("1"));
    });
  });
});

app.post("/get_data/order/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    // db.collection("crops").find({ tb_status: "0"}).toArray(function(err, result) {
    db.collection("order_details")
      .find({ $and: [{ or_status: "1" }] })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});

app.post("/get_data/contact_details/", urlencodedParser, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    var db = db.db("shopzilla");

    // db.collection("crops").find({ tb_status: "0"}).toArray(function(err, result) {
    db.collection("contact")
      .find({ $and: [{ cn_status: "0" }] })
      .toArray(function (err, result) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      });
  });
});
// ================================ Web Related Code ends ============================= //

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
