const config = require('./config.js');
const ethers = require('ethers');
const provider = new ethers.JsonRpcProvider(config.RPC);
const miner = new ethers.Wallet(config.PRIVATE_KEY, provider);
const HYPERSOUND_ADDRESS = '0x7E82481423B09c78e4fd65D9C1473a36E5aEd405';
const HYEPRSOUND_ABI = require('./abi.json')
const hypersound = new ethers.Contract(HYPERSOUND_ADDRESS, HYEPRSOUND_ABI, miner);


async function mine (_nonce) {
    try {
        const tx = await hypersound.connect(miner).mine('0x', { nonce: _nonce, gasLimit: 19930000 })
        console.log('Mine transaction sent with the nonce', _nonce)
        tx.wait().then(result => {
            console.log('Mine transaction confirmed with the nonce', _nonce)
        })
    } catch (e) {
        console.error('An error occurred while executing the transaction with the nonce', _nonce, e)
    }
}

provider.getTransactionCount(miner.address).then(nonce => {
    mine(nonce)

    setInterval(() => {
        mine(++nonce)
    }, 60000 / config.MINE_TX_PER_MINUTE)
})

