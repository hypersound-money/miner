require('dotenv').config()
const { createPublicClient, createWalletClient, http } = require('viem')
const { privateKeyToAccount } = require('viem/accounts')
const { blast } = require('viem/chains')

const publicClient = createPublicClient({
	chain: blast,
	transport: http(process.env.RPC)
})

const privateKey = process.env.PRIVATE_KEY.startsWith('0x') ? process.env.PRIVATE_KEY : `0x${process.env.PRIVATE_KEY}`
const account = privateKeyToAccount(privateKey)
const walletClient = createWalletClient({
	chain: blast,
	transport: http(process.env.RPC),
	account
})

const HYPERSOUND_ADDRESS = '0xF8797dB8a9EeD416Ca14e8dFaEde2BF4E1aabFC3'
const HYEPRSOUND_ABI = require('./abi.json')

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function mine() {
	try {
		let hash
		const mineAmount = process.env.CALLS_PER_MINE_TX
		if (mineAmount === '1') { // mine one with mine()
			hash = await walletClient.writeContract({
				address: HYPERSOUND_ADDRESS,
				abi: HYEPRSOUND_ABI,
				functionName: 'mine',
				args: ['0x'],
				account
			})
		} else { // mine multiple with mineBatch()
			hash = await walletClient.writeContract({
				address: HYPERSOUND_ADDRESS,
				abi: HYEPRSOUND_ABI,
				functionName: 'mineBatch',
				args: [BigInt(mineAmount), '0x'],
				account
			})
		}
		console.log('Mine transaction sent. Hash:', hash)

		const receipt = await publicClient.waitForTransactionReceipt({ hash })
		console.log('Mine transaction confirmed')
	} catch (e) {
		console.error('An error occurred while executing the transaction', e)
	}
}

let isRunning = true

async function start() {
	while (isRunning) {
		await mine()
		await sleep(60000 / parseInt(process.env.MINE_TX_PER_MINUTE))
	}
}

start()

// Handle graceful shutdown for docker
process.on('SIGINT', () => {
	console.log('Shutting down...')
	isRunning = false
})

