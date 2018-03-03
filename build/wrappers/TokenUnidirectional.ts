import * as BigNumber from 'bignumber.js'
import * as Web3 from 'web3'
import * as truffle from 'truffle-contract'

export namespace TokenUnidirectional {
  export const ARTIFACT = require('../contracts/TokenUnidirectional.json')

  export interface Contract {
    address: string

    isPresent: {
      (channelId: string): Promise<boolean>
      call (channelId: string): Promise<boolean>
    }
    canDeposit: {
      (channelId: string, origin: string): Promise<boolean>
      call (channelId: string, origin: string): Promise<boolean>
    }
    paymentDigest: {
      (channelId: string, payment: BigNumber.BigNumber): Promise<string>
      call (channelId: string, payment: BigNumber.BigNumber): Promise<string>
    }
    canStartSettling: {
      (channelId: string, origin: string): Promise<boolean>
      call (channelId: string, origin: string): Promise<boolean>
    }
    isAbsent: {
      (channelId: string): Promise<boolean>
      call (channelId: string): Promise<boolean>
    }
    isSettling: {
      (channelId: string): Promise<boolean>
      call (channelId: string): Promise<boolean>
    }
    channels: {
      (index: string): Promise<[string, string, string, BigNumber.BigNumber, BigNumber.BigNumber, BigNumber.BigNumber]>
      call (index: string): Promise<[string, string, string, BigNumber.BigNumber, BigNumber.BigNumber, BigNumber.BigNumber]>
    }
    isOpen: {
      (channelId: string): Promise<boolean>
      call (channelId: string): Promise<boolean>
    }
    canSettle: {
      (channelId: string): Promise<boolean>
      call (channelId: string): Promise<boolean>
    }
    canClaim: {
      (channelId: string, payment: BigNumber.BigNumber, origin: string, signature: string): Promise<boolean>
      call (channelId: string, payment: BigNumber.BigNumber, origin: string, signature: string): Promise<boolean>
    }

    open: {
      (channelId: string, receiver: string, settlingPeriod: number|BigNumber.BigNumber, erc20contract: string, value: BigNumber.BigNumber, options?: Web3.CallData): Promise<truffle.TransactionResult>
      call (channelId: string, receiver: string, settlingPeriod: number|BigNumber.BigNumber, erc20contract: string, value: BigNumber.BigNumber, options?: Web3.CallData): Promise<void>
      estimateGas (channelId: string, receiver: string, settlingPeriod: number|BigNumber.BigNumber, erc20contract: string, value: BigNumber.BigNumber): Promise<number>
    }
    deposit: {
      (channelId: string, value: BigNumber.BigNumber, options?: Web3.CallData): Promise<truffle.TransactionResult>
      call (channelId: string, value: BigNumber.BigNumber, options?: Web3.CallData): Promise<void>
      estimateGas (channelId: string, value: BigNumber.BigNumber): Promise<number>
    }
    claim: {
      (channelId: string, payment: BigNumber.BigNumber, signature: string, provider: string, options?: Web3.CallData): Promise<truffle.TransactionResult>
      call (channelId: string, payment: BigNumber.BigNumber, signature: string, provider: string, options?: Web3.CallData): Promise<void>
      estimateGas (channelId: string, payment: BigNumber.BigNumber, signature: string, provider: string): Promise<number>
    }
    settle: {
      (channelId: string, options?: Web3.CallData): Promise<truffle.TransactionResult>
      call (channelId: string, options?: Web3.CallData): Promise<void>
      estimateGas (channelId: string): Promise<number>
    }
    startSettling: {
      (channelId: string, options?: Web3.CallData): Promise<truffle.TransactionResult>
      call (channelId: string, options?: Web3.CallData): Promise<void>
      estimateGas (channelId: string): Promise<number>
    }

    send: (value: BigNumber.BigNumber | number) => Promise<truffle.TransactionResult>
    sendTransaction: (opts: Web3.CallData) => Promise<truffle.TransactionResult>
  }

  export interface DidOpen {
    channelId: string
    sender: string
    receiver: string
    value: BigNumber.BigNumber
  }

  export function isDidOpenEvent (something: truffle.AnyTransactionEvent): something is truffle.TransactionEvent<DidOpen> {
    return something.event === 'DidOpen'
  }
  export interface DidDeposit {
    channelId: string
    deposit: BigNumber.BigNumber
  }

  export function isDidDepositEvent (something: truffle.AnyTransactionEvent): something is truffle.TransactionEvent<DidDeposit> {
    return something.event === 'DidDeposit'
  }
  export interface DidClaim {
    channelId: string
  }

  export function isDidClaimEvent (something: truffle.AnyTransactionEvent): something is truffle.TransactionEvent<DidClaim> {
    return something.event === 'DidClaim'
  }
  export interface DidStartSettling {
    channelId: string
  }

  export function isDidStartSettlingEvent (something: truffle.AnyTransactionEvent): something is truffle.TransactionEvent<DidStartSettling> {
    return something.event === 'DidStartSettling'
  }
  export interface DidSettle {
    channelId: string
  }

  export function isDidSettleEvent (something: truffle.AnyTransactionEvent): something is truffle.TransactionEvent<DidSettle> {
    return something.event === 'DidSettle'
  }

  export function contract (provider?: Web3.Provider, defaults?: Web3.CallData): truffle.TruffleContract<Contract> {
    let instance = truffle<Contract>(ARTIFACT)
    if (provider) {
      instance.setProvider(provider)
    }
    if (defaults) {
      instance.defaults(defaults)
    }
    return instance
  }
}

export default TokenUnidirectional
