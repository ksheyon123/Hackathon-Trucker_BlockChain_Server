var express = require('express');
var userRouter = express.Router();

//Middleware
var userModel = require('../model/userModel');
var registerUser = require('../model/registerUser');
// var web3js = require('../model/web3');

userRouter.get('/', (req, res, next) => {
    res.render('index.ejs')
});

userRouter.get('/pricing', (req, res) => {
    res.render('pricing.ejs');
})

userRouter.get('/contact', (req, res) => {
    res.render('contact.ejs');
})

userRouter.post('/login', async (req, res) => {
    try {
        console.log('hi')
        await userModel.login(req);
        console.log('login session', req.session.user)
        res.status(200).send(req.session.user);
    } catch(err) {
        res.status(500).send(false);
    }
});

userRouter.get('/logout', (req, res) => {
    console.log('hi')
    if (req.session.user) {
        req.session.destroy(err => {
            console.log('failed: ' + err);
            return;
        });
        console.log('success');
        res.status(200).redirect('/');
    } else return;
});

userRouter.get('/main', (req, res) => {
    res.render('main.ejs')
});

userRouter.post('/register', async (req, res) => {
    try {
        console.log(req.body);
        var result = await userModel.register(req);
        await registerUser.registerUser(req.session.user.userID);

        res.status(200).send(result)
    } catch(err) {
        console.log(err);
    }
});

module.exports = userRouter;