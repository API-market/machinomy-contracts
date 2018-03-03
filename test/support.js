"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var contract = require('truffle-contract');
function getNetwork(web3) {
    return new Promise(function (resolve, reject) {
        web3.version.getNetwork(function (error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(parseInt(result, 10));
            }
        });
    });
}
exports.getNetwork = getNetwork;
var ERC20Example;
(function (ERC20Example) {
    var Json = require('../build/contracts/ERC20example.json');
    ERC20Example.deploy = function (provider, opts) {
        var instance = contract(Json);
        if (provider) {
            instance.setProvider(provider);
        }
        return instance.new(opts);
    };
    function deployed(provider) {
        var instance = contract(Json);
        if (provider) {
            instance.setProvider(provider);
        }
        return instance.deployed();
    }
    ERC20Example.deployed = deployed;
})(ERC20Example = exports.ERC20Example || (exports.ERC20Example = {}));
//# sourceMappingURL=support.js.map