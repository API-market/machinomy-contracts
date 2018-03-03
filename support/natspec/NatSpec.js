"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("ethereumjs-util");
var AbiType;
(function (AbiType) {
    AbiType["Function"] = "function";
    AbiType["Constructor"] = "constructor";
    AbiType["Event"] = "event";
    AbiType["Fallback"] = "fallback";
})(AbiType || (AbiType = {}));
var NatSpec;
(function (NatSpec) {
    function functionSignature(signature) {
        return util.sha3(signature).toString('hex').substr(0, 8);
    }
    function functionDefinition(entry, definition) {
        let inputParams = definition.inputs;
        let name = definition.name;
        let signature = `${name}(${inputParams.map(i => i.type).join(',')})`;
        let devDocs = entry.devdoc.methods[signature] || {};
        let userDocs = entry.userdoc.methods[signature] || {};
        let params = devDocs.params || {};
        let inputs = inputParams.map(param => (Object.assign({}, param, { description: params[param.name] })));
        delete devDocs.params;
        let outputParams;
        let outputs;
        try {
            outputParams = JSON.parse(devDocs.return);
        }
        catch (e) {
            try {
                const split = devDocs.return.split(' ');
                const name = split.shift();
                outputParams = { [name]: split.join(' ') };
            }
            catch (e2) { }
        }
        try {
            outputs = definition.outputs.map(param => (Object.assign({}, param, { description: outputParams[param.name] })));
        }
        catch (e) { }
        return Object.assign({}, definition, devDocs, userDocs, { inputs,
            outputs,
            signature, signatureHash: signature && functionSignature(signature) });
    }
    function eventDefinition(entry, definition) {
        let inputParams = definition.inputs;
        let name = definition.name;
        let signature = `${name}(${inputParams.map(i => i.type).join(',')})`;
        let devDocs = entry.devdoc.methods[signature] || {};
        let userDocs = entry.userdoc.methods[signature] || {};
        let params = devDocs.params || {};
        let inputs = inputParams.map(param => (Object.assign({}, param, { description: params[param.name] })));
        delete devDocs.params;
        return Object.assign({}, definition, devDocs, userDocs, { inputs,
            signature, signatureHash: signature && functionSignature(signature) });
    }
    function buildDefinition(entry, definition) {
        switch (definition.type) {
            case AbiType.Function:
                return functionDefinition(entry, definition);
            case AbiType.Event:
                return eventDefinition(entry, definition);
            case AbiType.Constructor:
                return Object.assign({}, definition, { inputs: definition.inputs });
            case AbiType.Fallback:
                return Object.assign({}, definition, { inputs: [] });
            default:
                throw new Error(`Got unexpected definition ${definition.type}`);
        }
    }
    function buildEntry(fileName, name, entry) {
        return {
            fileName: fileName,
            author: entry.devdoc.author,
            title: entry.devdoc.title,
            name: name,
            abiDocs: entry.abi.map(definition => buildDefinition(entry, definition)),
            abi: entry.abi
        };
    }
    async function build(input, whitelist = []) {
        let contracts = input.contracts;
        let result = {};
        Object.keys(contracts).forEach(fileName => {
            let contractEntry = contracts[fileName];
            let name = Object.keys(contractEntry)[0];
            if (whitelist.length > 0 && whitelist.includes(name)) {
                result[name] = buildEntry(fileName, name, contractEntry[name]);
            }
        });
        return result;
    }
    NatSpec.build = build;
})(NatSpec = exports.NatSpec || (exports.NatSpec = {}));
exports.default = NatSpec;
