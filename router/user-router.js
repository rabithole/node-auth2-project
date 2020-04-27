const router = require("express").Router();

// The below middleware was added server.js file. 
const restricted = require('../auth/restricted-middleware.js');

const Users = require("./user-model.js");

router.get("/", (req, res) => {
  // This is another way to add the middleware const restricted above. 
  // if(req.session && req.session.user) {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send({ message: 'It did not work!' }));
  // } else {
  //   res.status(401).json({ message: 'not logged in' })
  // }
});

module.exports = router;
