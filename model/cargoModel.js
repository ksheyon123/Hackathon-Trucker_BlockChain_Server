var myConnection = require('../dbConfig');

var moment = require('moment');
require('moment-timezone');


class Cargo {
    cargoRegistration(data) {
        return new Promise(
            async (resolve, reject) => {
                try {
                    moment.tz.setDefault("git Asia/Seoul");
                    var date = moment().format('YYYY-MM-DD HH:mm:ss');
                    console.log('cargoRegi', data)
                    var sql = 'INSERT INTO cargodb (company, startpoint, endpoint, carweight, weight, transport, cost, cargoup, cargodown, memo, date) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                    await myConnection.query(sql,[data.companycode, data.startpoint, data.endpoint, data.carweight, data.weight, data.transport, data.cost, data.cargoup, data.cargodown, data.memo, date]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    callAllCargo() {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM cargodb WHERE status = 0';
                    var result = myConnection.query(sql);
                    console.log(result[0]);
                    resolve(result);
                } catch(err) {
                    reject(err);
                }
            }
        )
    }

    cargoBeforeDeparture(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'UPDATE cargodb SET status = 1 WHERE id = ?';
                    myConnection.query(sql, [data]);
                    resolve(true);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    putReadyList(data) {
        return new Promise ( 
            async (resolve, reject) => {
                try {
                    console.log(data)
                    var sql = 'INSERT INTO readycargodb (user, code) values (?, ?)';
                    await myConnection.query(sql, [data.userID, data.id]);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    putReadyListStatus(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = `UPDATE readycargodb SET status = 1 WHERE code = ?`;
                    await myConnection.query(sql, [data]);
                    resolve(true);
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

    getReadyListOnDB(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    console.log(data)
                    var sql = 'SELECT id, code, status FROM readycargodb WHERE user = ?';
                    var result = await myConnection.query(sql, [data]);
                    resolve(result[0][0]);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    getCargoBasedOnCode(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT * FROM cargodb WHERE id = ?';
                    var result = await myConnection.query(sql, [data])
                    resolve(result[0][0]);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    getDistanceBasedOnCode(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT distance FROM readycargodb WHERE code = ?';
                    var result = await myConnection.query(sql, [data]);
                    resolve(result[0][0]);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
    changeDataOfReadyList(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'UPDATE readycargodb SET user = "done" WHERE code = ?';
                    await myConnection.query(sql, [data]);
                    resolve(true);
                } catch(err) {
                    reject(err);
                }
            }
        )
    }
    getOrder(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    var sql = 'SELECT MAX(id) AS data FROM orderdb';
                    var result = await myConnection.query(sql);
                    console.log('data', result[0][0].data)
                    if(result[0][0].data == null) {
                        
                        var up = 'INSERT INTO orderdb (abc) values (?)';
                        await myConnection.query(up,[data])
                        resolve(0);
                    } else {
                        console.log(data)
                        var up = `INSERT INTO orderdb (abc) values (?)`;
                        await myConnection.query(up,[data])
                        resolve(result[0][0].data);
                    }
                } catch (err) {
                    reject(err)
                }
            }
        )
    }

}

module.exports = new Cargo();