const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { join } = require("path");
const authConfig = require("./auth_config.json");
const autho0Mgmt = require("./management.js")
const app = express();
app.use(express.json())

if (!authConfig.domain || !authConfig.audience) {
  throw "Please make sure that auth_config.json is in place and populated";
}

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "public")));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"]
});

app.post("/api/external", checkJwt, (req, res) => {
  var userId = req.user['sub'];
 // check weather loged in user has email varified or not.
   if (!req.user['https://api.pizza42.com/verified']) {
     res.send({
         msg: "Please Verify your email before placing an order"         

     });
   }
  // Update the user metadata with the ordered pizza name.
 else{
  autho0Mgmt.updateUserMetadata(userId, req.body.pizzaName);
  res.send({
    msg: "Thank you For Ordering with Pizza42!"
  });
 }
  
});

app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});

app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ msg: "Invalid token" });
  }

  next(err, req, res);
});

process.on("SIGINT", function() {
  process.exit();
});

module.exports = app;
