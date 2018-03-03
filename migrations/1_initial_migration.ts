import * as Deployer from 'truffle-deployer'

const Migrations = artifacts.require('./Migrations.sol')
const CPU = artifacts.require('./CPU.sol')

module.exports = function (deployer: Deployer) {
  return deployer.deploy(Migrations)
  .then(() => {
    return deployer.deploy(CPU)
  })
}
