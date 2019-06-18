const express = require('express');
require('dotenv').config();
// Used for validating the JWT
const jwt = require("express-jwt");
// Used to retrieve RSA keys from a JSON Web Key Set (JWKS) endpoint
const jwksRsa = require("jwks-rsa");
// Used to validate the JWT scopes
const validateScope = require("express-jwt-authz");

const REQ_USER_ROLES_KEY = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/roles`;

// Verify signature
const validateJwt = jwt({
    // Provide a signing key dynamically based on the KID in the header and the
    // signing keys provided by the JWKS endpoint
    secret : jwksRsa.expressJwtSecret({
        cache: true, // Set to true to cache the signing key
        rateLimit: true,
        jwksRequestsPerMinute: 25, // Set a limit to prevent attackers from requesting more then 'n' times per minute
        jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
    }),

    // For validating the audience and the issuer
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

    // Use the same signing algorithm as is set for the API configuration.
    // This is found in the Auth0 dashboard under the applications advanced setting in the OAuth tab
    algorithms: ["RS256"]
});

const app = express();

app.get("/public", function(req, res) {
    res.json({
       message: "Hello from a public API"
    });
});

// Add validateJwt as an argument to validating the request. Request will fail if validateJwt fails
app.get("/private", validateJwt, function(req, res) {
    res.json({
        message: "Hello from a private API"
    });
});

// 'Pretend' endpoint for requesting a list of a users courses to demo the usage of scopes.
// Specify the scope(s) required to make this request in the validateScope param.
// The successful result is a list of courses.
// With an actual database these would be queried to the database using the subscriber ID
app.get("/courses", validateJwt, validateScope(["read:courses"]), function(req, res) {
    res.json({
        courses: [
            { id: 1, title: "Building Apps with React and Redux" },
            { id: 2, title: "Creating Reusable React Components" }
        ]
    });
});

// "Admin" API to demonstrate validating roles
app.get("/admin", validateJwt, validateRole('admin'), function(req, res) {
    res.json({
        message: "Hello from an admin API"
    });
});

function validateRole(role) {
    return function (req, res, next) {
        const assignedRoles = req.user[REQ_USER_ROLES_KEY];
        if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
            return next();
        } else {
            return res.status(401).send("Insufficient role");
        }
    };
}

app.listen(process.env.REACT_APP_SERVER_PORT);
console.log("API server listening on " + process.env.REACT_APP_API_URL);
