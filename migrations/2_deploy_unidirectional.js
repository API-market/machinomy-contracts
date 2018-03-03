"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ECRecovery = artifacts.require('ECRecovery.sol');
const Unidirectional = artifacts.require('Unidirectional.sol');
const TokenUnidirectional = artifacts.require('TokenUnidirectional.sol');
module.exports = function (deployer) {
    return deployer.deploy(ECRecovery)
        .then(() => {
        return deployer.link(ECRecovery, Unidirectional);
    })
        .then(() => {
        return deployer.link(ECRecovery, TokenUnidirectional);
    })
        .then(() => {
        return deployer.deploy(Unidirectional);
    })
        .then(() => {
        return deployer.deploy(TokenUnidirectional);
    });
};
//# sourceMappingURL=2_deploy_unidirectional.js.map