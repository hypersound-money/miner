const config = require('./config.js');
const ethers = require('ethers');
const provider = new ethers.JsonRpcProvider(config.RPC);
const miner = new ethers.Wallet(config.PRIVATE_KEY, provider);
const HYPERSOUND_ADDRESS = '0x7E82481423B09c78e4fd65D9C1473a36E5aEd405';
const HYEPRSOUND_ABI = require('./abi.json')
const hypersound = new ethers.Contract(HYPERSOUND_ADDRESS, HYEPRSOUND_ABI, miner);

async function mine () {
	const nonce = await provider.getTransactionCount(miner.address);

	hypersound.connect(miner).mine('0x', { nonce: nonce, gasLimit: 19930000 }).then(tx => {
		console.log('Mine transaction sent with the nonce', nonce)
		tx.wait().then(result => {
    		console.log('Mine transaction confirmed with the nonce', nonce)
    	}).catch(e => {
    		console.error('An error occurred while executing the transaction with the nonce', nonce, e)
    	})
	}).catch(e => {
		console.error('An error occurred while executing the transaction with the nonce', nonce, e)
	})
}

mine()

setInterval(() => {
	mine()
}, 60000 / config.MINE_TX_PER_MINUTE)
