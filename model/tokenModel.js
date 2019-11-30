var myConnection = require('../dbConfig');
var web3js = require('./web3');

class Token {
    purchaseToken(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var result = await web3js.token_purchase(data);
                    if(result == true) {
                        var balance = await web3js.get_balance(data.userWallet)
                        resolve(balance);
                    } else {
                        console.log('Purchase Token Err', err)
                    }
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
    getTokenBalance(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var result = await web3js.get_balance(data);
                    console.log(result)
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    loadProduct(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    // console.log('loadProduct1', data)
                    var result = await web3js.loadProduct(data);
                    resolve(true);
                } catch (err) {
                    reject(err)
                    console.log(err);
                }
            }
        )
    }
    downProduct(payID) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    // console.log('payID: ',payID)
                    var result = await web3js.downProduct(payID);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    getAbleBalance(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var result = await web3js.getAbleBalance(data);
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

}

module.exports = new Token();