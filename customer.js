// This file will contain the queries to the customer table
const database = require("./database");
const express = require("express");

// Allows us to define a mapping from the URI to a function
router = express.Router();

// can be used to define a GET API.   URI -> CB function.
router.get("/customer/all", (request, response) => {
  database.connection.all("select * from customer", (errors, results) => {
    if (errors) {
      response.status(500).send("Some error occurred");
    } else {
      response.status(200).send(results);
    }
  });
});
//Note: use query instead of all for MySQL - database.connection.query("select * from customer"

// defines an API which takes id in the request and return the record in response
router.get("/customer/id", (request, response) => {
  database.connection.all(
    `select * from customer where customer_id = ${request.query.cid}`,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred");
      } else {
        response.status(200).send(results);
      }
    }
  );
});

// defines an API which takes customer email in the request and returns list of orders placed by the customer
router.get("/customer/email", (request, response) => {
  sqlst = `SELECT customer.name cn, item.name, shop_order.id, shop_order.quantity
            FROM customer, item, shop_order
            WHERE shop_order.custEmail = customer.email 
            AND shop_order.itemID = item.id 
            AND customer.email = "${request.query.cid}"`; 
  database.connection.all(
    sqlst,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred" + sqlst);
      } else {
        response.status(200).send(results);
      }
    }
  );
});


// a POST API to add a new customer record received in the request
router.post("/customer/add", (request, response) => {
  database.connection.all(
    `INSERT INTO customer VALUES ('${request.body.nemail}','${request.body.nname}', '${request.body.npwd}')`,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred");
      } else {
        response.status(200).send("Record saved successfully!");
      }
    }
  );
});


// a PUT API to update password for given customer email
router.put("/customer/changepass", (request, response) => {
  sqlstmt = `UPDATE customer SET pwd = "${request.body.cpwd}"
    WHERE customer.email  = "${request.body.cemail}"`;
  
  database.connection.all(
   sqlstmt,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred" + sqlstmt);
      } else {
        response.status(200).send("Record updated successfully!" + sqlstmt);
      }
    }
  );
});



// POST + PUT = Body, GET + DELETE = Query
router.delete("/customer/delete", (request, response) => {
  database.connection.all(
    `DELETE FROM customer WHERE email  = "${request.query.cid}"`,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred");
      } else {
        response.status(200).send("Record deleted successfully!");
      }
    }
  );
});


// defines an API which takes customer email in the request and returns list of orders placed by the customer
router.get("/customer/login", (request, response) => {
  sqlst = `SELECT customer.name cn, item.name, shop_order.id, shop_order.quantity
  FROM customer, item, shop_order
  WHERE shop_order.custEmail = customer.email 
  AND shop_order.itemID = item.id 
  AND shop_order.custEmail = "${request.query.lemail}"
  AND customer.pwd = "${request.query.lpwd}"`; 
  database.connection.all(
    sqlst,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred" + sqlst);
      } else {
        response.status(200).send(results);
      }
    }
  );
});



// defines a Login API which takes customer email and password in the request and returns list of orders placed by the customer if the email and pwd matches
/*router.get("/customer/login", (request, response) => {
  sqlst = `SELECT customer.name cn, item.name, shop_order.id, shop_order.quantity
            FROM customer, item, shop_order
            WHERE shop_order.custEmail = customer.email 
            AND shop_order.itemID = item.id 
            AND shop_order.custEmail = "${request.body.lemail}" 
            AND customer.pwd = "${request.body.lpwd}"`; 
  database.connection.all(
    sqlst,
    (errors, results) => {
      if (errors) {
        response.status(500).send("Some error occurred" + sqlst);
      } else {
        response.status(200).send(results);
      }
    }
  );
});
*/

module.exports = {
  router,
};


