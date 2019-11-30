var myConnection = require('../dbConfig.js');
var web3js = require('./web3');
// var Contract = require('./abi');
// var myContract = Contract.myContract;
// var web3 = Contract.web3;


class  User {
    login(req) {
        var ca = req.body.ca;
        var InsertedUser = req.body.phonenumber;
        var InsertedPassword = req.body.password;
        return new Promise(
            async (resolve, reject) => {
                try {
                    if(ca == 'web') {
                        const sql = `SELECT * FROM companydb WHERE phonenumber = ? AND password = ?`;
                        var result = await myConnection.query(sql, [InsertedUser, InsertedPassword]);
                        var balance = await web3js.get_balance(result[0][0].wallet);
                        req.session.user = {
                            userID: result[0][0].phonenumber,
                            userNM: result[0][0].name,
                            userWallet: result[0][0].wallet,
                            userBalance: balance,
                        }
                        resolve(req.session.user);
                    } else {
                        console.log('login', InsertedUser, InsertedPassword)
                        const sql = `SELECT * FROM driverdb WHERE phonenumber = ? AND password = ?`;
                        var result = await myConnection.query(sql, [InsertedUser, InsertedPassword]);
                        var balance = await web3js.get_balance(result[0][0].wallet)
                        req.session.user = {
                            userID: result[0][0].phonenumber,
                            userNM: result[0][0].name,
                            userCN: result[0][0].carnumber,
                            userCW: result[0][0].carweight,
                            userWallet: result[0][0].wallet,
                            userBalance: balance,
                        }
                        resolve(req.session.user);
                    }
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    register(req) {
        if(req.body.ca == 'web') {
            var ca = req.body.ca;
            var InsertedUser = req.body.phonenumber;
            var InsertedPassword = req.body.password;
            var InsertedName = req.body.username;
        }
        if(req.body.ca == 'app') {
            var ca = req.body.ca;
            var InsertedUser = req.body.phonenumber;
            var InsertedPassword = req.body.password;
            var InsertedName = req.body.username;
            var InsertedCarnumber = req.body.carnumber;
            var InsertedCarweight = req.body.carweight;
        } 
        return new Promise(
            async (resolve, reject) => {
                try {
                    var allData = await this.selectAll(ca);
                    let flags = 0;
                    // console.log('hi1')
                    for(const content of allData[0]) {
                        if(content.phonenumber == InsertedUser) {
                            flags = 1;
                            break;
                        }
                    }
                    // console.log('flags : ', flags)

                    switch (flags) {
                        case 0:
                            if(ca == 'web') {
                                // var web3Data = await web3js.makeAccounts(InsertedPassword);
                                var web3Data = await web3js.makeAccounts(InsertedPassword)
                                console.log('web3Data', web3Data)

                                var balance = await web3js.get_balance(web3Data)
                                const sql = 'INSERT INTO companydb (phonenumber,name, password, wallet) values (?, ?, ?, ?)';
                                await myConnection.query(sql, [InsertedUser,InsertedName, InsertedPassword, web3Data]);
                                req.session.user = {
                                    userID: InsertedUser,
                                    userNM: InsertedName,
                                    userWallet: web3Data,
                                    userBalance: balance,
                                }
                                console.log(req.session.user)
                            resolve(req.session.user);
                            } else {
                                // var web3Data = await web3js.makeAccounts(InsertedPassword);
                                var web3Data = await web3js.makeAccounts(InsertedPassword);
                                var balance = await web3js.get_balance(web3Data);
                                const sql = 'INSERT INTO driverdb (phonenumber, name, carnumber,carweight, password, wallet) values (?, ?, ?, ?, ?, ?)';
                                await myConnection.query(sql, [InsertedUser, InsertedName, InsertedCarnumber,InsertedCarweight, InsertedPassword, web3Data]);
                                req.session.user = {
                                    userID: InsertedUser,
                                    userNM: InsertedName,
                                    userCN: InsertedCarnumber,
                                    userCW: InsertedCarweight,
                                    userWallet: web3Data,
                                    userBalance: balance,
                                }
                                resolve(req.session.user);
                            }
                        case 1:
                            resolve('중복된 아이디입니다.');
                            break;
                    }
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    selectAll(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    if (data == 'web') {
                        const sql = 'SELECT * FROM companydb';
                        var result = await myConnection.query(sql);
                        resolve(result);
                    } else {
                        const sql = 'SELECT * FROM driverdb';
                        var result = await myConnection.query(sql);
                        resolve(result);
                    }
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    getUserWalletBasedOnCode(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT wallet FROM companydb WHERE phonenumber IN (SELECT company From cargodb WHERE id = ?)';
                    var result = await myConnection.query(sql, [data])
                    resolve(result[0][0]);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }
}

module.exports = new User();