const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const DEFAULTS_JSON_PATH = join(__dirname, '..', 'config', 'default.json');

const json = JSON.parse(readFileSync(DEFAULTS_JSON_PATH, 'utf8'));

exports.default = json;
exports.name = json.name;
exports.version = json.version;
exports.productName = json.productName;
exports.build = json.build;
