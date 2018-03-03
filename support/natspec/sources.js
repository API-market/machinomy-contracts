"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const truffleContractSources = require("truffle-contract-sources");
const Profiler = require("truffle-compile/profiler");
const Config = require("truffle-config");
const Resolver = require("truffle-resolver");
const Artifactor = require("truffle-artifactor");
/**
 * Configuration of the current Truffle project.
 */
async function currentConfig() {
    let config = Config.default();
    config.resolver = new Resolver(config);
    config.artifactor = new Artifactor();
    config.paths = await contractPaths(config);
    config.base_path = config.contracts_directory;
    return config;
}
exports.currentConfig = currentConfig;
/**
 * Paths to the contracts managed by Truffle.
 */
async function contractPaths(config) {
    return new Promise((resolve, reject) => {
        truffleContractSources(config.contracts_directory, (err, files) => {
            err ? reject(err) : resolve(files);
        });
    });
}
exports.contractPaths = contractPaths;
/**
 * Sources of contracts along with the dependencies, for the current Truffle project.
 */
async function requiredSources(config) {
    return new Promise((resolve, reject) => {
        Profiler.required_sources(config, (err, sources) => {
            err ? reject(err) : resolve(sources);
        });
    });
}
exports.requiredSources = requiredSources;
