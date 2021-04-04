/** @format */

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
const port = process.argv[2]
const rp = require('request-promise')
const {v4: uuid} = require('uuid')
const cors = require('cors')

const nodeAddress = uuid().split('-').join('')

//const crypto= require('crypto');
//const nodeAddress = crypto.randomBytes(16).toString('base64');

const sfsc = new Blockchain()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

// get entire blockchain
app.get('/blockchain', function (req, res) {
	res.send(sfsc)
})

// create a new transaction
app.post('/transaction', function (req, res) {
	const newTransaction = req.body
	const blockIndex = sfsc.addTransactionToPendingTransactions(newTransaction)
	res.json({note: `Transaction will be added in block ${blockIndex}.`})
})

// broadcast transaction
app.post('/transaction/broadcast', function (req, res) {
	const newTransaction = sfsc.createNewTransaction(req.body.npk, req.body.farmer)
	console.log(newTransaction)
	const dealerAddress = '	AGRORYTHUSEVAKENDRAMNBDNDFNHCFUJ'
	// Logic
	const fertilizerType = npk => {
		const N = npk.split('-').slice(0, 2).parseInt()
		const P = npk.split('-').slice(2, 4).parseInt()
		const K = npk.split('-').slice(-2).parseInt()

		var r1 = 4 - N / K
		var r2 = 2 - P / K
		if (K < 1) var r3 = 1 - K
		else var r3 = 1
		if (r1 == 0 && r2 == 0 && r3 == 0) return 'NPK Values are ideal,No fertilizer required'
		if (r1 < r2 && r1 < r3) return 'Urea(46:0:0)'
		if (r2 < r1 && r2 < r3) return 'Di-Ammonium Phosphate(DAP)'
		if (r3 < r1 && r3 < r2) return 'Murate of Potash(M.O.P)'
		if (r1 == r2 && r3 == 0) return '20:20:0'
		if (r1 - r2 <= 0.2 && r3 == 0) return '28:28:0'
		if (r1 - r2 <= 0.2 && r2 - r3 <= 0.2) return '16:16:16'
		if (r1 - r2 <= 0.3 && r2 - r3 <= 0.3) return '17:17:17'

		return 'Particular Fertilizer Not Available'
	}

	res.json({
		...newTransaction,
		dealerAddress,
		fertilizerType,
	})
	sfsc.addTransactionToPendingTransactions(newTransaction)

	const requestPromises = []
	sfsc.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true,
		}

		requestPromises.push(rp(requestOptions))
	})

	Promise.all(requestPromises)
		.then(data => {
			res.json({note: 'Transaction created and broadcast successfully.'})
		})
		.catch(e => {
			throw new Error(e.message)
		})
})

// mine a block
app.get('/mine', function (req, res) {
	const lastBlock = sfsc.getLastBlock()
	const previousBlockHash = lastBlock['hash']
	const currentBlockData = {
		transactions: sfsc.pendingTransactions,
		index: lastBlock['index'] + 1,
	}
	const nonce = sfsc.proofOfWork(previousBlockHash, currentBlockData)
	const blockHash = sfsc.hashBlock(previousBlockHash, currentBlockData, nonce)
	const newBlock = sfsc.createNewBlock(nonce, previousBlockHash, blockHash)

	const requestPromises = []
	sfsc.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: {newBlock: newBlock},
			json: true,
		}

		requestPromises.push(rp(requestOptions))
	})

	Promise.all(requestPromises).then(data => {
		console.log(data)
		res.json({
			...data,
			note: 'New block mined & broadcast successfully',
			block: newBlock,
		})
	})
})

// receive new block
app.post('/receive-new-block', function (req, res) {
	const newBlock = req.body.newBlock
	const lastBlock = sfsc.getLastBlock()
	const correctHash = lastBlock.hash === newBlock.previousBlockHash
	const correctIndex = lastBlock['index'] + 1 === newBlock['index']

	if (correctHash && correctIndex) {
		sfsc.chain.push(newBlock)
		sfsc.pendingTransactions = []
		res.json({
			note: 'New block received and accepted.',
			newBlock: newBlock,
		})
	} else {
		res.json({
			note: 'New block rejected.',
			newBlock: newBlock,
		})
	}
})

// register a node and broadcast it the network
app.post('/register-and-broadcast-node', function (req, res) {
	const newNodeUrl = req.body.newNodeUrl
	if (sfsc.networkNodes.indexOf(newNodeUrl) == -1) sfsc.networkNodes.push(newNodeUrl)

	const regNodesPromises = []
	sfsc.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: {newNodeUrl: newNodeUrl},
			json: true,
		}

		regNodesPromises.push(rp(requestOptions))
	})

	Promise.all(regNodesPromises)
		.then(data => {
			const bulkRegisterOptions = {
				uri: newNodeUrl + '/register-nodes-bulk',
				method: 'POST',
				body: {allNetworkNodes: [...sfsc.networkNodes, sfsc.currentNodeUrl]},
				json: true,
			}

			return rp(bulkRegisterOptions)
		})
		.then(data => {
			res.json({note: 'New node registered with network successfully.'})
		})
})

// register a node with the network
app.post('/register-node', function (req, res) {
	const newNodeUrl = req.body.newNodeUrl
	const nodeNotAlreadyPresent = sfsc.networkNodes.indexOf(newNodeUrl) == -1
	const notCurrentNode = sfsc.currentNodeUrl !== newNodeUrl
	if (nodeNotAlreadyPresent && notCurrentNode) sfsc.networkNodes.push(newNodeUrl)
	res.json({note: 'New node registered successfully.'})
})

// register multiple nodes at once
app.post('/register-nodes-bulk', function (req, res) {
	const allNetworkNodes = req.body.allNetworkNodes
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = sfsc.networkNodes.indexOf(networkNodeUrl) == -1
		const notCurrentNode = sfsc.currentNodeUrl !== networkNodeUrl
		if (nodeNotAlreadyPresent && notCurrentNode) sfsc.networkNodes.push(networkNodeUrl)
	})

	res.json({note: 'Bulk registration successful.'})
})

// consensus
app.get('/consensus', function (req, res) {
	const requestPromises = []
	sfsc.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true,
		}

		requestPromises.push(rp(requestOptions))
	})

	Promise.all(requestPromises).then(blockchains => {
		const currentChainLength = sfsc.chain.length
		let maxChainLength = currentChainLength
		let newLongestChain = null
		let newPendingTransactions = null

		blockchains.forEach(blockchain => {
			if (blockchain.chain.length > maxChainLength) {
				maxChainLength = blockchain.chain.length
				newLongestChain = blockchain.chain
				newPendingTransactions = blockchain.pendingTransactions
			}
		})

		if (!newLongestChain || (newLongestChain && !sfsc.chainIsValid(newLongestChain))) {
			res.json({
				note: 'Current chain has not been replaced.',
				chain: sfsc.chain,
			})
		} else {
			sfsc.chain = newLongestChain
			sfsc.pendingTransactions = newPendingTransactions
			res.json({
				note: 'This chain has been replaced.',
				chain: sfsc.chain,
			})
		}
	})
})

// get block by blockHash
app.get('/block/:blockHash', function (req, res) {
	const blockHash = req.params.blockHash
	const correctBlock = sfsc.getBlock(blockHash)
	res.json({
		block: correctBlock,
	})
})

// get transaction by transactionId
app.get('/transaction/:transactionId', function (req, res) {
	const transactionId = req.params.transactionId
	const trasactionData = sfsc.getTransaction(transactionId)
	res.json({
		transaction: trasactionData.transaction,
		block: trasactionData.block,
	})
})

// get address by address
app.get('/address/:address', function (req, res) {
	const address = req.params.address
	const addressData = sfsc.getAddressData(address)
	res.json({
		addressData: addressData,
	})
})

// block explorer
app.get('/block-explorer', function (req, res) {
	res.sendFile('./block-explorer/index.html', {root: __dirname})
})

app.listen(port, function () {
	console.log(`Listening on port ${port}...`)
})
