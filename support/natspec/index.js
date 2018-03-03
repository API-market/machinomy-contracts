#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const sources = require("./sources");
const compiler = require("./compiler");
const NatSpec_1 = require("./NatSpec");
async function write(fileName, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, data, error => {
            error ? reject(error) : resolve();
        });
    });
}
async function main() {
    let packageJsonFilename = path.resolve(__dirname, '../../package.json');
    let packageJson = JSON.parse(fs.readFileSync(packageJsonFilename).toString());
    let whitelist = packageJson.natspec.whitelist;
    let config = await sources.currentConfig();
    let fullText = await sources.requiredSources(config);
    let solcOutput = await compiler.doc(fullText);
    let natSpec = await NatSpec_1.default.build(solcOutput, whitelist);
    let outputFile = path.join(config.build_directory, 'doc', 'natspec.json');
    let asString = JSON.stringify(natSpec, null, 4);
    await write(outputFile, asString);
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
