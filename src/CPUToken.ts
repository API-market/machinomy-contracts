import Web3 = require('web3')
const contract = require('truffle-contract')
import BigNumber from 'bignumber.js'
import { TransactionResult } from 'truffle-contract'

const CPUJson = require('../build/contracts/CPU.json')

export namespace CPUToken {
  export interface Contract {
    address: string

    totalSupply (): Promise<TransactionResult>
    balanceOf (address: string): Promise<TransactionResult>
    allowance (owner: string, spender: string): Promise<BigNumber>

    transfer (to: string, value: BigNumber, opts?: Web3.TxData): Promise<TransactionResult>
    transferFrom (from: string, to: string, value: BigNumber, opts?: Web3.TxData): Promise<TransactionResult>
    approve (address: string, startChannelValue: BigNumber, opts?: Web3.TxData): Promise<TransactionResult>
  }

  export function at (provider?: Web3.Provider): Promise<Contract> {
    let instance = contract(CPUJson)
    if (provider) {
      instance.setProvider(provider)
    }
    return instance.deployed()
  }
}

export default CPUToken
