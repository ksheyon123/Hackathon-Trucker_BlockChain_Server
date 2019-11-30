var Web3 = require("web3");
var web3 = new Web3();

const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_payId",
				"type": "uint256"
			}
		],
		"name": "_load_down_product",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"name": "_get_balanceOf",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_companyAddress",
				"type": "address"
			},
			{
				"name": "_truckerAddress",
				"type": "address"
			},
			{
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "_load_up_product",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_companyAddress",
				"type": "address"
			}
		],
		"name": "_get_ablebalance",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "_get_product_count",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_companyAddress",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "_token_purchase",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "_get_payment_count",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_trcTokenContract",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "evtUpLoadProductFromTrucker",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "evtDownLoadProductFromTrucker",
		"type": "event"
	}
]
const contractAddr = '0x5b21FAD67768953Af70583742C8e2fe77e5870ED';
const myContract = new web3.eth.Contract(abi, contractAddr);

module.exports = { myContract, web3 };
