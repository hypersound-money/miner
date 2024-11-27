require('dotenv').config()
const ethers = require('ethers')

const provider = new ethers.JsonRpcProvider(process.env.RPC)
const miner = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
const HYPERSOUND_ADDRESS = '0xF8797dB8a9EeD416Ca14e8dFaEde2BF4E1aabFC3'
const HYEPRSOUND_ABI = require('./abi.json')
const hypersound = new ethers.Contract(HYPERSOUND_ADDRESS, HYEPRSOUND_ABI, miner)

async function mine (_nonce) {
	try {
		let tx
	
		if (parseInt(process.env.CALLS_PER_MINE_TX) === 1) {
			tx = await hypersound.connect(miner).mine('0x', { 
				nonce: _nonce, 
				gasLimit: parseInt('50000') 
			})
		} else {
			tx = await hypersound.connect(miner).mineBatch(
				parseInt(process.env.CALLS_PER_MINE_TX), 
				'0x', 
				{ 
					nonce: _nonce, 
					gasLimit: parseInt('25000000') 
				}
			)
		}
		
		console.log('Mine transaction sent with the nonce', _nonce)
		
		tx.wait().then(result => {
			console.log('Mine transaction confirmed with the nonce', _nonce)
		})
	} catch (e) {
		console.error('An error occurred while executing the transaction with the nonce', _nonce, e)
		console.log(e.code, e.info, e?.data?.info)
	}
}

provider.getTransactionCount(miner.address).then(nonce => {
	mine(nonce)

	setInterval(() => {
		mine(++nonce)
	}, 60000 / parseInt(process.env.MINE_TX_PER_MINUTE))
})

