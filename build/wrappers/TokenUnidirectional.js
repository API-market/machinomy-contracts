"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const truffle = require("truffle-contract");
var TokenUnidirectional;
(function (TokenUnidirectional) {
    TokenUnidirectional.ARTIFACT = require('../contracts/TokenUnidirectional.json');
    function isDidOpenEvent(something) {
        return something.event === 'DidOpen';
    }
    TokenUnidirectional.isDidOpenEvent = isDidOpenEvent;
    function isDidDepositEvent(something) {
        return something.event === 'DidDeposit';
    }
    TokenUnidirectional.isDidDepositEvent = isDidDepositEvent;
    function isDidClaimEvent(something) {
        return something.event === 'DidClaim';
    }
    TokenUnidirectional.isDidClaimEvent = isDidClaimEvent;
    function isDidStartSettlingEvent(something) {
        return something.event === 'DidStartSettling';
    }
    TokenUnidirectional.isDidStartSettlingEvent = isDidStartSettlingEvent;
    function isDidSettleEvent(something) {
        return something.event === 'DidSettle';
    }
    TokenUnidirectional.isDidSettleEvent = isDidSettleEvent;
    function contract(provider, defaults) {
        let instance = truffle(TokenUnidirectional.ARTIFACT);
        if (provider) {
            instance.setProvider(provider);
        }
        if (defaults) {
            instance.defaults(defaults);
        }
        return instance;
    }
    TokenUnidirectional.contract = contract;
})(TokenUnidirectional = exports.TokenUnidirectional || (exports.TokenUnidirectional = {}));
exports.default = TokenUnidirectional;
//# sourceMappingURL=TokenUnidirectional.js.map