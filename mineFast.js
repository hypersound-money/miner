/* 

This an aggressive version of the original mining script
It sends transactions in parallel

The default rpc rate limit is 1800 so don't use a MINE_TX_PER_MINUTE value higher than 1800 

Send a tip to 0xe376c370e5239bbf28e658d54948626e46a3308c if you found this script useful

*/

const config = require('./config.js');
const ethers = require('ethers');
const provider = new ethers.JsonRpcProvider(config.RPC);
const miner = new ethers.Wallet(config.PRIVATE_KEY, provider);
const HYPERSOUND_ADDRESS = '0x7E82481423B09c78e4fd65D9C1473a36E5aEd405';
const HYEPRSOUND_ABI = require('./abi.json')
const hypersound = new ethers.Contract(HYPERSOUND_ADDRESS, HYEPRSOUND_ABI, miner);

async function estimateGas() {
    try {
        let gasPrice = (await provider.getFeeData()).gasPrice;
		gasPrice  = (gasPrice * BigInt(110) ) / BigInt(100) // 10% higher gas
        const gasLimit = await hypersound.mine.estimateGas('0x');
        return { gasPrice, gasLimit };
    } catch (error) {
        console.error('Error estimating gas:', error);
        return null;
    }
}

async function mine(nonce, gasPrice, gasLimit) {
    try {
        const tx = await hypersound.connect(miner).mine('0x', { 
            nonce: nonce, 
            gasPrice: gasPrice,
            gasLimit: gasLimit
        });
        console.log('Mine transaction sent with nonce', nonce);
    } catch (e) {
        console.error('Error occurred with nonce', nonce, e);
    }
}

async function mineMultiple() {
	
	try {
		let nonce = await provider.getTransactionCount(miner.address);
		
		const gasEstimate = await estimateGas();
		if (!gasEstimate) return;

		const { gasPrice, gasLimit } = gasEstimate;
		
		const promises = [];
		for (let i = 0; i < config.MINE_TX_PER_MINUTE; i++) {
			promises.push(mine(nonce++, gasPrice, gasLimit));
		}
		await Promise.all(promises);
	} catch(e) {
		console.error('Error occurred', e);
	}
}

async function startMining() { 

    // Initial mining
    await mineMultiple();

    setInterval(mineMultiple, 60000);
}

startMining();