var express = require('express');
var mRouter = express.Router();

var cargoModel = require('../model/cargoModel.js');
var ccModel = require('../model/ccModel.js');
var tokenModel = require('../model/tokenModel.js');
var userModel = require('../model/userModel');

mRouter.get('/api/auth', async (req, res) => {
    try {
        console.log('api/auth', req.session.user)
        res.status(200).send(req.session.user);
    } catch (err) {
        console.log(err)
    }
});

mRouter.get('/api/cargo', async (req, res) => {
    try {
        var result = await cargoModel.callAllCargo();
        console.log(result[0]);
        res.status(200).send(result[0])
    } catch(err) {
        console.log(err)
        reject(err)
    }   
});

mRouter.post('/api/departure', async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.session.user)
        data = {
            id: req.body.id,
            userID: req.session.user.userID,
            startpoint: req.body.startpoint,
            endpoint: req.body.endpoint,
            carweight: req.body.carweight,
            weight: req.body.weight,
            transport: req.body.transport,
            distance: req.body.stoe,
            cost: req.body.cost,
        }
        await cargoModel.cargoBeforeDeparture(req.body.id);
        await cargoModel.putReadyList(data)
        res.status(200).send(true)
    } catch(err) {
        reject(err);
    }
});

mRouter.get('/api/list', async (req, res) => {
    try {
        var txList = await ccModel.getHistory(req.session.user.userID)
        console.log('txList', txList)
        if(!txList) {
            cargo = false;
        } else {
            data = {
                list: txList,
            }
        }
        console.log(data.cargo)
        res.status(200).send(data)
    } catch(err) {
        res.status(500).send(err)
    }
});

mRouter.get('/api/readycargo', async (req, res) => {
    try {
        var data = await cargoModel.getReadyListOnDB(req.session.user.userID);
        var result = await cargoModel.getCargoBasedOnCode(data.code);
        data = {
            data: result,
        }
        res.status(200).send(data);
    } catch (err) {
        console.log(err);
    }
});

mRouter.get('/api/readydata', async (req, res) => {
    try {
        var result = await cargoModel.getReadyListOnDB(req.session.user.userID);
        if(result == undefined) {
            result = {
                dkey: '0',
            }
            res.status(200).send(result);
        } else if (result.status == '0') {
            result.dkey = '1'
            res.status(200).send(result);
        } else if (result.status == '1') {
            result.dkey = '2'
            res.status(200).send(result);
        }
    } catch (err) {
        console.log(err)
    }
});

mRouter.post('/api/blockchaindata', async (req, res) => {
    try {
        console.log('/api/blockchaindata', req.body)
        var data = await cargoModel.getReadyListOnDB(req.session.user.userID);
        console.log(data)
        var result = await userModel.getUserWalletBasedOnCode(data.code);
        await cargoModel.putReadyListStatus(data.code);
        console.log(result.wallet)
        console.log(req.session.user.userID)
        //ChainCode UP Data
        data = {
            userID: req.session.user.userID,
            userWallet: req.session.user.userWallet,
            startpoint: req.body.startpoint,
            endpoint: req.body.endpoint,
            carweight: req.body.carweight,
            weight: req.body.weight,
            transport: req.body.transport,
            distance: req.body.distance,
            cost: req.body.cost,
        }
        var addresult = await ccModel.addTruck(data);
        if (addresult == true) {
            walletData = {
                userWallet: req.session.user.userWallet,
                companyWallet: result.wallet,
                cost: req.body.cost,
            }
            await tokenModel.loadProduct(walletData);
            res.status(200).send(true);
        }
    } catch (err) {
        console.log(err)
    }
});

mRouter.get('/api/token', async (req, res) => {
    try {
        console.log(req.session.user.userWallet)
        var result = await tokenModel.getTokenBalance(req.session.user.userWallet);
        res.status(200).send(result);
    } catch (err) {
        console.log(err)
    }
});

mRouter.post('/api/arrival', async (req, res) => {
    try {
        console.log(req.session.user)
        console.log(req.body)
        var data = await cargoModel.getReadyListOnDB(req.session.user.userID);
        console.log(data)
        var payID = await cargoModel.getOrder(data.id)
        console.log('payID', payID)
        await tokenModel.downProduct(payID);
        await cargoModel.changeDataOfReadyList(data.code);
        res.status(200).send(true);
    } catch (err) {
        console.log(err)
    }
});

mRouter.post('/getaverage', async (req, res) => {
    try {
        console.log('ad', req.body);
        console.log('ad', req.session.user)
        data = {
            geodata: req.body.geodata,
            userData: req.session.user,
        }
        var result = await ccModel.getAverage(data);
        console.log('getaverage result', result)
        res.status(200).send(result);
    } catch (err) {
        console.log(err)
    }
});

// mRouter.post('/average', async (req, res) => {
//     try {
//         console.log('average', req.body);
        

//           let gcs = startdata.coordinateInfo.coordinate[0];
//             console.log('gcs', gcs)
//           let response2 = await fetch(
//             `https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?addressFlag=F00&coordType=WGS84GEO&version=1&format=json&fullAddr=${req.body.endpoint}&appKey=88bebbd6-8f99-4144-a656-46abd418bba8`,
//             {
//               method: 'get',
//             },
//           );
//           let enddata = await response2.json();
//           let gce = enddata.coordinateInfo.coordinate[0];

//           await this._startToEndTrace(
//             gcs.newLon,
//             gcs.newLat,
//             gce.newLon,
//             gce.newLat,
//           );

//           _startToEndTrace = async (a, b, c, d) => {
//             let headers = {};
//             headers.appKey = '8cea5446-06f8-4412-bd63-a42e99290fad';
//             try {
//               let response = await fetch(
//                 `https://apis.openapi.sk.com/tmap/routes?endX=${c}&endY=${d}&startX=${a}&startY=${b}&reqCoordType=WGS84GEO&resCoordType=WGS84GEO&searchOption =0&trafficInfo =N`,
//                 {
//                   method: 'post',
//                   headers: headers,
//                 },
//               );
//               let json = await response.json();
//               if (response.ok) {
//                 res.status(200).send(json.features[0].properties.totalDistance);
//               }
//             } catch (err) {
//               console.log('bad', err);
//             }
//           };
//     } catch (err) {

//     }
// })

module.exports = mRouter;