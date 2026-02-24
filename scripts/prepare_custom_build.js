// prepare_build_prefix.js
// Copyright 2024 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

const fs = require('node:fs');
const _ = require('lodash');
const { default: packageJson } = require('./packageJson.js');

// ---------------------------
// Environment variables for prefixes
const CHANNEL = process.env.SIGNAL_CHANNEL || 'production'; // production, alpha, beta, adhoc
const APP_NAME = process.env.APP_NAME_PREFIX || 'signal';
const DOMAIN = process.env.DOMAIN_PREFIX || 'org.whispersystems';

const NAME_PREFIX = `${APP_NAME}-desktop`;
const PRODUCT_PREFIX = APP_NAME === 'signal' ? 'Signal' : _.startCase(APP_NAME);
const APPID_PREFIX = `org.${DOMAIN}.${APP_NAME}-desktop`;
const DESKTOP_PREFIX = APP_NAME;
const EXEC_PREFIX = `${APP_NAME}-desktop`;

// ---------------------------
// Generate final names
const config = {
  name: `${NAME_PREFIX}-${CHANNEL}`,
  productName: `${PRODUCT_PREFIX} ${_.startCase(CHANNEL)}`,
  appId: `${APPID_PREFIX}-${CHANNEL}`,
  wmClass: `${APP_NAME} ${_.startCase(CHANNEL)}`,
  desktopName: `${DESKTOP_PREFIX} ${_.startCase(CHANNEL)}.desktop`,
  executableName: `${EXEC_PREFIX}-${CHANNEL}`,
}

// ---------------------------
// Update package.json dynamically
function updatePackageJson(pkg, cfg) {
  _.set(pkg, 'name', cfg.name);
  _.set(pkg, 'productName', cfg.productName);
  _.set(pkg, 'build.appId', cfg.appId);
  _.set(pkg, 'build.linux.desktop.entry.StartupWMClass', cfg.wmClass);
  _.set(pkg, 'desktopName', cfg.desktopName);
  _.set(pkg, 'build.linux.executableName', cfg.executableName);
}

// ---------------------------
// Apply changes
console.log(`Preparing ${CHANNEL} build with prefixes:`);
console.log(JSON.stringify(config, null, 2));

updatePackageJson(packageJson, config);
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
console.log(`package.json updated for ${CHANNEL} build`);
