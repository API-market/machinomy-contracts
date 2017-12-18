import * as Web3 from 'web3'
import * as chai from 'chai'
import * as asPromised from 'chai-as-promised'
import { Broker } from '../src'
import BigNumber from 'bignumber.js'
import { getNetwork } from './support'
import { sign, paymentDigest } from '../src/index'

chai.use(asPromised)

const expect = chai.expect

const web3 = (global as any).web3 as Web3

let _broker: Broker.Contract | null = null
async function deployedBroker (sender: string): Promise<Broker.Contract> {
  if (_broker) {
    return _broker
  } else {
    let contract = Broker.contract(web3.currentProvider, { from: sender, gas: 2700000 })
    let networkId = await getNetwork(web3)
    _broker = await contract.new(networkId)
    return _broker
  }
}

contract('Broker', async accounts => {
  const sender = accounts[0]
  const receiver = accounts[1]

  const createChannel = async (instance: Broker.Contract) => {
    let options = { value: web3.toWei(1, 'ether'), gas: 3000000 }
    const log = await instance.createChannel(receiver, new BigNumber(100), new BigNumber(1), options)
    return log.logs[0]
  }

  it('create channel', async () => {
    let instance = await deployedBroker(sender)
    let event = await createChannel(instance)
    expect(event.event).to.equal('DidCreateChannel')
    expect(event.args.channelId).to.be.a('string')
  })

  it('deposit', async () => {
    let instance = await deployedBroker(sender)
    const event = await createChannel(instance)

    let startBalance = web3.eth.getBalance(instance.address)
    let delta = web3.toWei(1, 'ether')
    const channelId = event.args.channelId
    const logDeposit = await instance.deposit(channelId, {from: accounts[0], value: delta})

    const endBalance = web3.eth.getBalance(instance.address)

    expect(logDeposit.logs[0].event).to.equal('DidDeposit')
    expect(endBalance).to.deep.equal(startBalance.plus(delta))
  })

  it('claim by receiver', async () => {
    let instance = await deployedBroker(sender)
    const event = await createChannel(instance)

    const channelId = event.args.channelId
    const value = new BigNumber(1)
    const chainId = await getNetwork(web3)
    const digest = paymentDigest(channelId, value, instance.address, chainId)
    const signature = await sign(web3, sender, digest)
    const v = signature.v
    const r = '0x' + signature.r.toString('hex')
    const s = '0x' + signature.s.toString('hex')
    const evt = await instance.claim(channelId, value, new BigNumber(v), r, s, {from: receiver})

    expect(evt.logs[0].event).to.equal('DidSettle')
    expect(evt.logs[0].args.payment.toString()).to.equal(value.toString())
  })

  it('settle by sender', async () => {
    let instance = await deployedBroker(sender)

    const didCreateEvent = await createChannel(instance)
    const channelId = didCreateEvent.args.channelId
    const value = new BigNumber(1)

    const startSettleResult = await instance.startSettle(channelId, value, { from: sender })
    expect(startSettleResult.logs[0].event).to.equal('DidStartSettle')

    const canFinishSettle = await instance.canFinishSettle(sender, channelId)
    expect(canFinishSettle).to.equal(false)
    expect(async () => {
      await instance.finishSettle(channelId, { from: sender }) // tslint:disable-line
    }).to.throw
  })

  it('settle by sender, then by receiver', async () => {
    let instance = await deployedBroker(sender)

    const didCreateEvent = await createChannel(instance)
    const channelId = didCreateEvent.args.channelId
    const value = new BigNumber(1)

    const chainId = await getNetwork(web3)
    const digest = paymentDigest(channelId, value, instance.address, chainId)
    const signature = await sign(web3, sender, digest)
    const v = signature.v
    const r = '0x' + signature.r.toString('hex')
    const s = '0x' + signature.s.toString('hex')

    const canFinishSettle = await instance.canFinishSettle(receiver, channelId)
    expect(canFinishSettle).to.equal(false)

    const claimResult = await instance.claim(channelId, value, new BigNumber(v), r, s, {from: receiver})
    expect(claimResult.logs[0].event).to.equal('DidSettle')
    expect(claimResult.logs[0].args.payment.toString()).to.equal(value.toString())
  })
})
