"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract = require('truffle-contract');
const CPUJson = require('../build/contracts/CPU.json');
var CPUToken;
(function (CPUToken) {
    function at(provider) {
        let instance = contract(CPUJson);
        if (provider) {
            instance.setProvider(provider);
        }
        return instance.deployed();
    }
    CPUToken.at = at;
})(CPUToken = exports.CPUToken || (exports.CPUToken = {}));
exports.default = CPUToken;
//# sourceMappingURL=CPUToken.js.map