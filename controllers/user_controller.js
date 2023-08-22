const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')

const userRegister = (req, res) => {
    const { fullName, email, contact, role, username, password } = req.body;


    // Check if user with the same email or username already exists

    User.findOne({ $or: [{ email: email }, { username: username }] })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ error: 'Email or username already exists' });
            }

            // Hash the password
            bcrypt.genSalt(10)
                .then(salt => bcrypt.hash(password, salt))
                .then(hashedPassword => {
                    // Create a new user
                    const newUser = new User({
                        fullName: fullName,
                        email: email,
                        contact: contact,
                        role: role,
                        username: username,
                        password: hashedPassword
                    });

                    // Save the user to the database
                    newUser.save()
                        .then(savedUser => {
                            res.status(201).json(savedUser);
                        })
                        .catch(error => {
                            res.status(500).json({ error: 'Failed to register user' });
                        });
                })
                .catch(error => {
                    res.status(500).json({ error: 'Failed to hash password' });
                });
        })
        .catch(error => {
            res.status(500).json({ error: 'Failed to check existing user' });
        });
}


const userLogin = (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'user not found' });
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(400).json({ error: 'password does not match' });
                    }

                    const payload = {
                        id: user.id,
                        role: user.role,
                        email: user.email,
                        username: user.username,
                        fullName: user.fullName
                    };

                    jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }
                        user.save()
                            .then(() => {
                                res.json({ token: token, user: user});
                            })
                            .catch(err => res.json({ error: err.message }));
                    });
                })
                .catch(err => res.json({ error: err.message }));

        })
        .catch(err => res.json({ error: err.message }));

};



module.exports = { userRegister, userLogin }