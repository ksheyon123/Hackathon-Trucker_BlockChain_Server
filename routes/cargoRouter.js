var express = require('express');
var cargoRouter = express.Router();

//Middleware
var cargoModel = require('../model/cargoModel');
var tokenModel = require('../model/tokenModel');
var ccModel = require('../model/ccModel');

cargoRouter.post('/regcargo', async (req, res) => {
    try {
        console.log('regcargo', req.body.memo)
        console.log(req.session.user)
        var cargodata = {
            companycode: req.session.user.userID,
            startpoint: req.body.startpoint,
            endpoint: req.body.endpoint,
            carweight: req.body.carweight,
            weight: req.body.weight,
            transport: req.body.transport,
            cost: req.body.cost,
            cargoup: req.body.cargoup,
            cargodown: req.body.cargodown,
            memo: req.body.memo,
        }
        var Token = await tokenModel.getTokenBalance(req.session.user.userWallet);
        console.log(cargodata.cost)
        if(parseInt(Token) < parseInt(cargodata.cost)) {
            console.log('잔액부족')
            res.status(200).send(false)
        } else {
            console.log('transaction summited')
            await cargoModel.cargoRegistration(cargodata);
            res.status(200).send(true);
        }  
    } catch(err) {
        res.status(500).send(err);
    }
});

cargoRouter.post('/delcargo', async (req, res) => {
    try {
        //get Company index number -> select enrolled cargo list
        var result = await cargoModel.callAllCargo(req.session.user);
        console.log(result[0])
        res.status(200).send(result[0])
    } catch (err) {
        res.status(500).send(err);
    }
});

cargoRouter.get('/components/jusoPopup/:id', (req, res) => {
    console.log(req.params)
    if(req.params.id == 'startpoint') {
        res.render('components/juso1.ejs');
    } else {
        res.render('components/juso2.ejs');
    }
});



module.exports = cargoRouter;