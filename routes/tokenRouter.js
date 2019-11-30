var express = require('express');
var tokenRouter = express.Router();

//Middleware
var tokenModel = require('../model/tokenModel');

tokenRouter.post('/api/token', async (req, res) => {
    try {
        console.log(req.body)
        data = {
            userWallet: req.session.user.userWallet,
            token: req.body.balance
        }
        var result = await tokenModel.purchaseToken(data);
        console.log(result);
        req.session.user.userBalance = result;
        res.status(200).send(req.session.user);
    } catch (err) {
        console.log(err)
    }
});

tokenRouter.get('/api/balance', async (req, res) => {
    try {
        console.log('hi')
        var result = await tokenModel.getAbleBalance(req.session.user.userWallet);
        console.log(result);
        res.status(200).send(result);
    } catch (err) {
        console.log(err)
    }
});

module.exports = tokenRouter;