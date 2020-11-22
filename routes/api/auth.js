const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
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
                        process.env.JWT_SECRET,
                        (err, token) => {
                            if (err) throw err;
                            res.cookie('access_token', token, {
                                maxAge: 2 * 60 * 60 * 1000,
                                httpOnly: true,
                                path: '/'
                                // secure: true
                            })
                            res.json({
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    auth: true
                                },
                                userId: user.id
                            })
                        }
                    )
                })
        })
})

router.get('/loadUser', auth, (req, res) => {
    const token = req.cookies.access_token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.id, { password: 0 }, (err, user) => {
        if (err) return res.status(500).json({ message: 'There was a problem finding the user' });
        if (!user) return res.status(404).json({ message: 'No user found' });

        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                auth: true
            },
            userId: user.id
        })
    })
})

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));
})

router.get('/logout', auth, (req, res) => {
    const options = {
        expires: new Date(Date.now() + 10000),
        secure: process.env.NODE_ENV === 'production' ? true : false,
        httpOnly: true
    }
    res.cookie('access_token', 'expired token', options)
    res.status(200).json({ status: 'logout success' })
})

module.exports = router;