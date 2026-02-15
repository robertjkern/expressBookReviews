const express = require('express');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT = 5000;

app.use(express.json());

// Session middleware for customer routes
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
  })
);

// Mount routers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
