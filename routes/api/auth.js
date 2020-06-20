const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

const validateLoginInput = require('../../validation/loginValidation');

//User Model
const User = require('../../models/userModel');

router.post('/', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({
                msg: 'User does not exist',
                auth: false
            });

            //Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 604800 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    auth: true
                                }
                            })
                        }
                    )
                })
        })
})

router.get('/status', auth, (req, res) => {
    User.findById(req.userId, { password: 0 }, (err, user) => {
        if (err) return res.status(500).json({ message: 'There was a problem finding the user' });
        if (!user) return res.status(404).json({ message: 'No user found' });

        res.status(200).json(user)
    })
})

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));
})

module.exports = router;