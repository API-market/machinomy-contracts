import * as Deployer from 'truffle-deployer'

const ECRecovery = artifacts.require('ECRecovery.sol')
const Unidirectional = artifacts.require('Unidirectional.sol')
const TokenUnidirectional = artifacts.require('TokenUnidirectional.sol')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(ECRecovery)
  .then(() => {
    return deployer.link(ECRecovery, Unidirectional)
  })
  .then(() => {
    return deployer.link(ECRecovery, TokenUnidirectional)
  })
  .then(() => {
    return deployer.deploy(Unidirectional)
  })
  .then(() => {
    return deployer.deploy(TokenUnidirectional)
  })
}
