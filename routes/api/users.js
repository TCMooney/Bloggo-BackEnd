const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateRegisterInput = require('../../validation/registerValidation');

//User Model
const User = require('../../models/userModel');

// router.get('/getPostById/:id', (req, res) => {
//     BlogPost.findById(req.params.id, (err, post) => {
//         res.json(post);
//     })
// })

router.get('/getAuthor/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        res.json(user)
    })
})

router.post('/', (req, res) => {
    console.log(res.session)
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const { name, email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'User already exists' });

            const newUser = new User({
                name,
                email,
                password
            });

            //Create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            jwt.sign(
                                { id: user.id },
                                process.env.JWT_SECRET,
                                { expiresIn: 604800 },
                                (err, token) => {
                                    if (err) throw err;
                                    sessionData = req.session;
                                    sessionData.access_token = token;
                                    res.json({
                                        user: {
                                            id: user.id,
                                            name: user.name,
                                            email: user.email,
                                            auth: true
                                        },
                                        userId: user.id,
                                        sessionData
                                    })
                                }
                            )
                        });
                })
            })
        })
})

module.exports = router;