const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname,'contracts','lottery.sol');
const contract = fs.readFileSync(lotteryPath,'utf8');

module.exports = solc.compile(contract,1).contracts[':Lottery'];

