"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const solc = require("solc");
async function doc(fullText) {
    const standardInput = {
        language: 'Solidity',
        sources: {},
        settings: {
            outputSelection: {
                '*': {
                    '*': [
                        'devdoc',
                        'userdoc',
                        'abi'
                    ]
                }
            }
        }
    };
    for (let name in fullText) {
        standardInput.sources[name] = {
            content: fullText[name]
        };
    }
    let result = solc.compileStandard(JSON.stringify(standardInput));
    return JSON.parse(result);
}
exports.doc = doc;
