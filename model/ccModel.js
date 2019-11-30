// Hyperledger Bridge
const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const ccpPath = path.resolve(__dirname, '..', 'network' ,'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

class ccModel {

    addTruck(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    console.log('addTruck', data)
                    // Create a new file system based wallet for managing identities.
                    const walletPath = path.join(process.cwd(), 'wallet');
                    const wallet = new FileSystemWallet(walletPath);
                    console.log(`Wallet path: ${walletPath}`);
                    // Check to see if we've already enrolled the user.
                    const userExists = await wallet.exists(data.userID);

                    if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                    }
                    // Create a new gateway for connecting to our peer node.
                    const gateway = new Gateway();
                    await gateway.connect(ccp, { wallet, identity: data.userID, discovery: { enabled: false } }); 
                    // Get the network (channel) our contract is deployed to.
                    const network = await gateway.getNetwork('trucker');
                    // Get the contract from the network.
                    const contract = network.getContract('cargo');
                    //  Submit the specified transaction.
                    //  createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                    //  changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                    //  await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
                    await contract.submitTransaction('addTruck', data.userID, data.startpoint, data.endpoint, data.carweight, data.weight, data.transport, data.cost, JSON.stringify(data.distance));
                    console.log('Transaction has been submitted');
                    // Disconnect from the gateway.
                    await gateway.disconnect();
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    getTruck(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    // Create a new file system based wallet for managing identities.
                    const walletPath = path.join(process.cwd(), 'wallet');
                    const wallet = new FileSystemWallet(walletPath);
                    console.log(`Wallet path: ${walletPath}`);
                    // Check to see if we've already enrolled the user.
                    const userExists = await wallet.exists(data);

                    if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        resolve(false)
                    } else {
                        // Create a new gateway for connecting to our peer node.
                        const gateway = new Gateway();
                        await gateway.connect(ccp, { wallet, identity: data, discovery: { enabled: false } }); 
                        // Get the network (channel) our contract is deployed to.
                        const network = await gateway.getNetwork('trucker');
                        // Get the contract from the network.
                        const contract = network.getContract('cargo');
                        //  Submit the specified transaction.
                        //  createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                        //  changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                        //  await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
                        var result = await contract.submitTransaction('getTruck', data);
                        const myobj = JSON.parse(result.toString());
                        console.log('Transaction has been submitted');
                        // Disconnect from the gateway.
                        await gateway.disconnect();
                        resolve(myobj);
                    } 
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    getHistory(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    // Create a new file system based wallet for managing identities.
                    const walletPath = path.join(process.cwd(), 'wallet');
                    const wallet = new FileSystemWallet(walletPath);
                    console.log(`Wallet path: ${walletPath}`);
                    // Check to see if we've already enrolled the user.
                    const userExists = await wallet.exists(data);

                    if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        resolve(false)
                    } else {
                        // Create a new gateway for connecting to our peer node.
                        const gateway = new Gateway();
                        await gateway.connect(ccp, { wallet, identity: data, discovery: { enabled: false } }); 
                        // Get the network (channel) our contract is deployed to.
                        const network = await gateway.getNetwork('trucker');
                        // Get the contract from the network.
                        const contract = network.getContract('cargo');
                        //  Submit the specified transaction.
                        //  createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                        //  changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                        //  await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
                        var result = await contract.submitTransaction('getHistory', data);
                        const myobj = JSON.parse(result.toString());
                        console.log('Transaction has been submitted');
                        // Disconnect from the gateway.
                        await gateway.disconnect();
                        resolve(myobj);
                    } 
                } catch (err) {
                    reject(err);
                }
            }
        )
    }

    getAverage(data) {
        return new Promise (
            async (resolve, reject) => {
                try {
                    console.log('get', data.geodata)
                    // Create a new file system based wallet for managing identities.
                    const walletPath = path.join(process.cwd(), 'wallet');
                    const wallet = new FileSystemWallet(walletPath);
                    console.log(`Wallet path: ${walletPath}`);
                    // Check to see if we've already enrolled the user.
                    const userExists = await wallet.exists(data.userData.userID);

                    if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        resolve(false)
                    } else {
                        // Create a new gateway for connecting to our peer node.
                        const gateway = new Gateway();
                        await gateway.connect(ccp, { wallet, identity: data.userData.userID, discovery: { enabled: false } }); 
                        // Get the network (channel) our contract is deployed to.
                        const network = await gateway.getNetwork('trucker');
                        // Get the contract from the network.
                        const contract = network.getContract('cargo');
                        //  Submit the specified transaction.
                        //  createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                        //  changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                        //  await contract.submitTransaction('createCar', 'CAR11', 'Hnda', 'Aord', 'Bla', 'Tom');
                        var result = await contract.submitTransaction('getAverage', data.geodata);
                        var lastdata = result.toString();
                        if(lastdata == ' ') {
                            await gateway.disconnect();
                            resolve('NoData');
                        } else {
                            const myobj = JSON.parse(result.toString());
                            console.log('Transaction has been submitted');
                            // Disconnect from the gateway.
                            await gateway.disconnect();
                            resolve(myobj);
                        }
                    } 
                } catch (err) {
                    reject(err);
                }
            }
        )
    }
}

module.exports = new ccModel();