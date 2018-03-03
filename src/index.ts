import Unidirectional from '../build/wrappers/Unidirectional'
import TokenUnidirectional from '../build/wrappers/TokenUnidirectional'
import * as ethUtil from 'ethereumjs-util'
const truffleContract = require('truffle-contract')
import * as Web3 from 'web3'
const CPUJson = require('../build/contracts/CPU.json')

export {
  Unidirectional
}

export {
  TokenUnidirectional
}

export function randomId (digits: number = 3) {
  const datePart = new Date().getTime() * Math.pow(10, digits)
  const extraPart = Math.floor(Math.random() * Math.pow(10, digits)) // 3 random digits
  return datePart + extraPart // 16 digits
}

export function channelId (sender: string, receiver: string): string {
  let random = randomId()
  let buffer = ethUtil.sha3(sender + receiver + random)
  return ethUtil.bufferToHex(buffer)
}

export let buildCPUContract = (address: string, web3: Web3): Promise<any> => {
  return new Promise((resolve, reject) => {
    web3.version.getNetwork((error, result) => {
      if (error) {
        return reject(error)
      }
      let networks: any = {}
      networks[result] = { address }
      Object.assign(CPUJson, { networks } )
      const CPUContract = truffleContract(CPUJson)
      CPUContract.setProvider(web3.currentProvider)
      resolve(CPUContract)
    })
  })
}
