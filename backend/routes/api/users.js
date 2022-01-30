const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load User Model
const User = require("../../models/User");
const keys = require('../../config/keys');
const auth = require('../../middleware/auth');

router.post("/register", (req, res) => {
    //Form Validation
    const { errors, isValid } = validateRegisterInput(req.body);

    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    //Finding User by email
    User.findOne({ email: req.body.email }).then(user => {
        //Checking if user exists
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Hashing password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))
                });
            });
        }
    });
});

router.post("/login", (req, res) => {
    //Form Validation
    const { errors, isValid } = validateLoginInput(req.body);
    //Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    //Finding User by email
    User.findOne({ email }).then(user => {
        //Checking if user exists
        if (!user) {
            return res.status(404).json({ email: "Email not found" })
        }
        //Checking password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user._id,
                    name: user.name
                };
                //Sign Token
                jwt.sign(payload, keys.secretOrKey, {
                    expiresIn: 31556926
                },
                    (err, token) => {
                        console.log(token);
                        res.json({
                            token,
                            user: {
                                id: user._id,
                                displayName: user.name
                            }
                        });
                    });
            } else {
                return res.status(400).json({ passwordincorrect: "Incorrect Password" });
            }
        });
    });
});

router.delete("/delete", auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) {
            return res.json(false);
        }
        const verified = jwt.verify(token, keys.secretOrKey);
        if (!verified) {
            return res.json(false);
        }
        const user = await User.findById(verified.id);
        if (!user) {
            return res.json(false);
        }
        return res.json(true);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        displayName: user.name,
        id: user._id
    });
});

module.exports = router;