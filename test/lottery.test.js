const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {interface,bytecode} = require('../compile');

const web3 = new Web3(ganache.provider());

//const interface = inbox.interface;
//const bytecode = inbox.bytecode;
//const initialString = 'Hi there!';
let fromAddress,lotteryContract,accounts;
beforeEach(async ()=>{
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    fromAddress = accounts[0];  
    
    
    lotteryContract = await new web3.eth.Contract(JSON.parse(interface))
                .deploy({data: bytecode})
                .send({from: fromAddress, gas: '1000000'});
           
    //Use one of the accounts to deploy the contract
});

describe('Lottery contract test',()=>{
   
    it('Successfully Deploy Test',()=>{
        assert.ok(lotteryContract.options.address);
    })
    it('Manager Test',async ()=>{
        const managerAddress = await lotteryContract.methods.manager().call();
        assert.equal(fromAddress, managerAddress);
       
    })
    it('1 Player can enter',async ()=>{
        await lotteryContract.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        const players = await lotteryContract.methods.getPlayers().call();   

        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
    })
    it('2 Players can enter',async ()=>{
        await lotteryContract.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02','ether')
        })
        await lotteryContract.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02','ether')
        })
        const players = await lotteryContract.methods.getPlayers().call();
        assert.equal(2,players.length);
        assert.equal(accounts[1],players[0]);
        assert.equal(accounts[2],players[1]);
    })
    it('Requires minimum ether 0.2',async ()=>{
      try{
        await lotteryContract.methods.enter().send({
            from:accounts[1],
            value: 10
        })
            assert(false);
        }catch(err){
            assert(err);
        }

    })
    it('Only manager allowed to PickWinner', async ()=>{
        try{
            await lotteryContract.methods.pickWinner().call({
            from: accounts[1]
            })
            assert(false)
        }catch(err){
            assert(err)
        }

    })

})


        






/* mocha example*/
/*
class Car{
    drive(){
        return 'vroom';
    }

    park(){
        return 'stopped';
    }
}
let car;
beforeEach(()=>{
     car = new Car();
});
describe("Car test cases",()=>{
    
    it("Park method",()=>{
        
        assert.equal(car.park(),'stopped');
    })
    it("Drive test",()=>{
        assert.equal(car.drive(),'vroom');
    })
})
*/