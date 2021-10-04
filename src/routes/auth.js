
const express = require('express');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');



const { secretKey, expiresIn } = require('../config').webToken;


const UserDao = require('../Dao/dao.user');


module.exports = () => {
    const api = express.Router();


    api.post('/login', async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ status: 'failed', message: 'please provide an email or password' });
        }

        try {
            let user = await UserDao.getOneByEmail(email);
            if (!user) {
                res.status(401).json({ status: 'failed', message: 'Invalid Credentials provided' });
            }
            let dbUserPass = user.password;
            let flag = await comparePasswordsPromisified(password, dbUserPass);
            if (flag) {
                user.password = '************';
                let token = await generateToken(user._id, user.userType);

                const payload = { user: user, token: token };
                res.status(200).json({ status: 'success', payload: payload, message: 'User Logged In successfully!' });
            } else {
                res.status(500).json({ status: 'failed', payload: null, message: 'Invalid username or password' });
            }
        } catch (err) {
            res.status(500).json({ status: 'failed', payload: null, message: err });
        }
    });


    api.post('/signup', async (req, res) => {
        try {
            const savedUser = await UserDao.addNew(req.body);

            res.status(200).json({ status: 'success', payload: savedUser, message: 'User created successfully!' });
        } catch (err) {
            res.status(500).json({ status: 'failed', payload: null, message: err });
        }
    });

    api.get('/logout', (req, res) => {
        try {
            res.status(200).json({ status: 'success', payload: null, message: 'User logout successfully!' });

            res.clearCookie('jwt');
            res.redirect('/login');

        } catch (err) {
            res.status(500).json({ status: 'failed', payload: null, message: err });


        }
    });

    return api;
}

function comparePasswordsPromisified(sent, existing) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(sent, existing, (err, same) => {
            if (err) {
                reject(err);
            }
            resolve(same);
        });
    });
}

function generateToken(userId, userType) {
    return new Promise((resolve, reject) => {
        jsonwebtoken.sign({ userId: userId, userType: userType }, secretKey, { expiresIn }, (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    });
}

