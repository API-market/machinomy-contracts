import * as Deployer from 'truffle-deployer'

const CPU = artifacts.require('CPU.sol')
const Migrations = artifacts.require('Migrations.sol')

module.exports = function (deployer: Deployer) {
  deployer.deploy(CPU)
  deployer.deploy(Migrations)
}
