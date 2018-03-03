#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const mkdirp = require("mkdirp");
const path = require("path");
const glob = require("glob");
const fs = require("fs");
const ContractTemplate_1 = require("./ContractTemplate");
let args = yargs
    .option('output', {
    describe: 'Folder for generated files',
    alias: 'o'
})
    .argv;
let pattern = args._[0];
let fileNames = glob.sync(pattern);
if (fileNames.length) {
    fileNames.forEach(fileName => {
        let templatesDir = path.resolve(__dirname, 'templates');
        let outputDir = path.resolve(__dirname, '..', '..', 'build', 'wrappers');
        if (!fs.existsSync(outputDir)) {
            mkdirp.sync(outputDir);
        }
        let transformer = new ContractTemplate_1.default(templatesDir, outputDir);
        transformer.render(fileName);
    });
}
else {
    console.error(`No Truffle Contract artifact found at ${pattern}`);
    process.exit(1);
}
