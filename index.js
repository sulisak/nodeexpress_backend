require("dotenv").config();
var express = require("express");
var cors = require("cors");
const mysql = require("mysql2");
// const bodyParser = require("body-parser");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// create the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

var app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.get("/helloworld", function (req, res, next) {
  res.json({ msg: "helloworld" });
});

app.get("/users", function (req, res, next) {
  // simple query
  connection.query("SELECT * FROM users", function (err, results, fields) {
    res.json(results);
  });
});
app.get("/buy_details", function (req, res, next) {
  // simple query
  connection.query(
    `SELECT b.id,p.name as product,b.qty as qty,u.name as username,u.email as useremail FROM product p 
    join buy b on p.id = b.productId join users u on u.id=b.uId`,
    function (err, results, fields) {
      res.json(results);
    }
  );
});

// create ================

app.post("/buy_details", function (req, res) {
  const { productId, qty, uId } = req.body;

  // Create an object to store the data
  const databuy = {
    productId: productId,
    qty: qty,
    uId: uId,
  };
  // Perform the database insertion
  connection.query(
    "INSERT INTO buy SET ?",
    databuy,
    function (error, results, fields) {
      console.log(databuy);
      if (error) {
        console.error("Can not into the database: " + error.stack);
        res.status(500).json({ error: "Can not into the database" });
        return;
      }
      // Successful insertion
      res.status(200).json({ message: "inserted successfully " });
    }
  );
});
// create ================
// delete ==================
app.delete("/buy_details/:id", function (req, res) {
  const id = req.params.id;

  // Perform the database deletion
  connection.query(
    "DELETE FROM buy WHERE id = ?",
    id,
    function (error, results, fields) {
      if (error) {
        console.error("Error deleting data from the database: " + error.stack);
        res
          .status(500)
          .json({ error: "Error deleting data from the database" });
        return;
      }

      // Check if any rows were affected
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Record need to delete not found in the database" });
        return;
      }
      // Successful deletion
      res.status(200).json({ message: "Data deleted successfully " });
    }
  );
});
// delete ==================
// update ==================
app.put("/buy_details/:id", function (req, res) {
  const id = req.params.id;
  const { productId, qty, uId } = req.body;

  // Create an object to store the updated data
  const updatedData = {
    productId: productId,
    qty: qty,
    uId: uId,
  };

  // Perform the database update
  connection.query(
    "UPDATE buy SET ? WHERE id = ?",
    [updatedData, id],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating data in the database: " + error.stack);
        res.status(500).json({ error: "Error updating data in the database" });
        return;
      }

      // Check if any rows were affected
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Data not found in the database" });
        return;
      }

      // Successful update
      res.status(200).json({ message: "Data updated successfully" });
    }
  );
});
// update ==================
// add product ================
app.post("/products", function (req, res) {
  const { name} = req.body;

  // Create an object to store the data
  const dataproduct = {
    name: name
  };
  // Perform the database insertion
  connection.query(
    "INSERT INTO product SET ?",
    dataproduct,
    function (error, results, fields) {
      console.log(dataproduct);
      if (error) {
        console.error("Can not into the database: " + error.stack);
        res.status(500).json({ error: "Can not into the database" });
        return;
      }
      // Successful insertion
      res.status(200).json({ message: "inserted successfully " });
    }
  );
});
// add product ================
// update product ==================
app.put("/products/:id", function (req, res) {
  const id = req.params.id;
  const { name } = req.body;

  // Create an object to store the updated data
  const updatedData = {
    name: name
  };

  // Perform the database update
  connection.query(
    "UPDATE product SET ? WHERE id = ?",
    [updatedData, id],
    function (error, results, fields) {
      if (error) {
        console.error("Error updating data in the database: " + error.stack);
        res.status(500).json({ error: "Error updating data in the database" });
        return;
      }

      // Check if any rows were affected
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Data not found in the database" });
        return;
      }

      // Successful update
      res.status(200).json({ message: "Data updated successfully" });
    }
  );
});
// update product ==================
// delete product ==================
app.delete("/products/:id", function (req, res) {
  const id = req.params.id;

  // Perform the database deletion
  connection.query(
    "DELETE FROM product WHERE id = ?",
    id,
    function (error, results, fields) {
      if (error) {
        console.error("Error deleting data from the database: " + error.stack);
        res
          .status(500)
          .json({ error: "Error deleting data from the database" });
        return;
      }

      // Check if any rows were affected
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "Record need to delete not found in the database" });
        return;
      }
      // Successful deletion
      res.status(200).json({ message: "Data deleted successfully " });
    }
  );
});
// delete product ==================

app.listen(4000, function () {
  console.log("CORS-enabled web server listening on port 4000");
});
