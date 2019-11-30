var myConnection = require('../dbConfig');
// var Web3 = require("web3");
// var web3 = new Web3();
var Contract = require('./abi');
var myContract = Contract.myContract;
var web3 = Contract.web3;


web3.setProvider(
    new web3.providers.HttpProvider('http://10.0.2.15:7545')
);

class web3js {
    makeAccounts(data) {
        console.log('web3js로 넘어온 data', data);
        return new Promise(
            async (resolve, reject) => {
                try {
                    var newAccount = await web3.eth.personal.newAccount(data);
                    // console.log('Ether Account', newAccount);
                    resolve(newAccount);
                } catch (err) {
                    console.log(err)
                    reject(err);
                }
            }
        );
    }

    token_purchase(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    // console.log('Accounts', data);
                    
                    await myContract.methods._token_purchase(data.userWallet, parseInt(data.token)).send({ from: '0x8a1c3C4539aD33B3e08F49d51115dDD1559c04bE', gas: 4000000});
                    resolve(true);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    get_balance(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var result = await myContract.methods._get_balanceOf(data).call();
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
                    // console.log('loadProduct2', data)
                    await myContract.methods._load_up_product(data.companyWallet, data.userWallet, data.cost).send({ from: '0x8a1c3C4539aD33B3e08F49d51115dDD1559c04bE', gas: 4000000})
                    console.log('tx Success!')
                    resolve(true)
                } catch(err) {
                    console.log(err)
                }
            }
        )
    }
    downProduct(payID) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    console.log('payID :', payID);
                    var result = await myContract.methods._load_down_product(payID).send({ from: "0x8a1c3C4539aD33B3e08F49d51115dDD1559c04bE", gas: 3000000 });
                    console.log('_load_down_product :', result);
                    resolve(true)
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
                    console.log(data)
                    var result = await myContract.methods._get_ablebalance(data).call();
                    console.log(result);
                    resolve(result);
                } catch (err) {
                    reject (err)
                }
            } 
        )
    }
}

module.exports = new web3js();