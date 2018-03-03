"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Migrations = artifacts.require('./Migrations.sol');
const CPU = artifacts.require('./CPU.sol');
module.exports = function (deployer) {
    return deployer.deploy(Migrations)
        .then(() => {
        return deployer.deploy(CPU);
    });
};
//# sourceMappingURL=1_initial_migration.js.map