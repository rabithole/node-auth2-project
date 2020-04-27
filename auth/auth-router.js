const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../router/user-model.js');

router.post('/register', (req, res) => {
    const user = req.body;
    console.log('register')
    // this takes the req.body and creates the hash
    const hash = bcrypt.hashSync(user.password, 8);
    // this takes the user password and assigns it to the hash. AKA, replaces the password with the hash. 
    user.password = hash;

    Users.add(user)
        .then(saved => {
            // const token = generateToken(saved);
            res.status(201).json({ message: 'User registered!' });
        })
        .catch(error => {
            res.status(500).json({ message: 'Register did not work!' });
        });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
    console.log(req.body)

    Users.findBy({ username })
        .first()
        .then(user => {
            const token = generateToken(user);

            res.status(200).json({ 
                message: 'Successful login!',
                jwt_token: token
            });

            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = username;
                res.status(200).json({ 
                    message: 'Successful login!',
                    jwt_token: token
                });
            } else {
                res.status(401).json({ message: 'invalid credentials' });
            }
        })
        .catch(error => {
           
            res.status(500).json(error);
        });
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    };
    const secret = 'thesecret';
    const options = {
        expiresIn: '20 min'
    };

    return jwt.sign(payload, secret, options);
}

router.delete('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).json({ message: 'error logging out:', error: err });
            } else {
                res.json({ message: 'logged out' });
            }
        });
    } else {
        res.end();
    }
});

module.exports = router;
