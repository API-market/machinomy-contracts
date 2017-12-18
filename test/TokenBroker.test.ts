import Web3 = require('web3')
import chai = require('chai')
import { TokenBroker } from '../src'
import BigNumber from 'bignumber.js'
import { ERC20Example, getNetwork } from './support'
import { sign, paymentDigest } from '../src/index'

const expect = chai.expect

const web3 = (global as any).web3 as Web3

interface Setup {
  broker: TokenBroker.Contract
  token: ERC20Example.Contract
}

contract('TokenBroker', async accounts => {
  const owner = accounts[0]
  const sender = accounts[1]
  const receiver = accounts[2]
  const startChannelValue = new BigNumber(2)
  const contract = TokenBroker.contract(web3.currentProvider, { from: sender, gas: 1200000 })

  const createChannel = async function (broker: TokenBroker.Contract, token: ERC20Example.Contract) {
    return await broker.createChannel(token.address, receiver, new BigNumber(100), new BigNumber(1), startChannelValue)
  }

  const setup = async function (): Promise<Setup> {
    let token = await ERC20Example.deploy(web3.currentProvider, { from: owner, gas: 2300000 })
    let broker = await contract.deployed()
    await token.mint(owner, 100, { from: owner })
    await token.mint(sender, 100, { from: owner })
    await token.mint(receiver, 100, { from: owner })
    return { broker, token }
  }

  it('create channel', async () => {
    let { broker, token } = await setup()
    let startBalance = await token.balanceOf(broker.address)

    await token.approve(broker.address, startChannelValue, {from: sender})
    await createChannel(broker, token)

    let newBalance = await token.balanceOf(broker.address)
    expect(newBalance).to.deep.equal(startBalance.plus(startChannelValue))
  })

  it('makes deposit', async () => {
    let { broker, token } = await setup()

    await token.approve(broker.address, startChannelValue, { from: sender })
    const res = await createChannel(broker, token)

    const channelId = res.logs[0].args.channelId
    let startBalance = await token.balanceOf(broker.address)

    await token.approve(broker.address, startChannelValue, { from: sender })
    await broker.deposit(channelId, startChannelValue, { from: sender })

    let newBalance = await token.balanceOf(broker.address)
    expect(newBalance).to.deep.equal(startBalance.plus(startChannelValue))
  })

  it('claimed by receiver', async () => {
    let { broker, token } = await setup()

    await token.approve(broker.address, startChannelValue, { from: sender })
    const res = await createChannel(broker, token)
    const channelId = res.logs[0].args.channelId

    const chainId = await getNetwork(web3)
    const digest = paymentDigest(channelId, startChannelValue, broker.address, chainId)
    const signature = await sign(web3, sender, digest)
    const v = signature.v
    const r = '0x' + signature.r.toString('hex')
    const s = '0x' + signature.s.toString('hex')

    const startReceiverBalance = await token.balanceOf(receiver)
    await broker.claim(channelId, startChannelValue, new BigNumber(v), r, s, {from: receiver, gas: 200000})
    const newReceiverBalance = await token.balanceOf(receiver)

    expect(newReceiverBalance).to.deep.equal(startReceiverBalance.plus(startChannelValue))
  })

  it(`closed by sender`, async () => {
    let { broker, token } = await setup()

    await token.approve(broker.address, startChannelValue, { from: sender })
    const res = await createChannel(broker, token)
    const channelId = res.logs[0].args.channelId

    const startBalance = await token.balanceOf(receiver)

    await broker.startSettle(channelId, startChannelValue, {from: sender})

    expect(async () => {
      await broker.finishSettle(channelId, { from: sender }) // tslint:disable-line
    }).to.throw

    const finishBalance = await token.balanceOf(receiver)
    expect(finishBalance).to.deep.equal(startBalance)
  })

  it(`closed by sender, then by receiver`, async () => {
    let { broker, token } = await setup()

    await token.approve(broker.address, startChannelValue, { from: sender })
    const res = await createChannel(broker, token)
    const channelId = res.logs[0].args.channelId

    await broker.startSettle(channelId, startChannelValue, {from: sender})

    const chainId = await getNetwork(web3)
    const digest = paymentDigest(channelId, startChannelValue, broker.address, chainId)
    const signature = await sign(web3, sender, digest)
    const v = signature.v
    const r = '0x' + signature.r.toString('hex')
    const s = '0x' + signature.s.toString('hex')

    const balanceBefore = await token.balanceOf(receiver)
    await broker.claim(channelId, startChannelValue, Number(v), r, s, {from: receiver, gas: 90000})
    const balanceAfter = await token.balanceOf(receiver)

    expect(balanceAfter).to.deep.equal(balanceBefore.plus(startChannelValue))
  })

})
