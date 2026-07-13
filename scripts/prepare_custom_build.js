// prepare_build_prefix.js
// Copyright 2024 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import fs from 'node:fs';
import _ from 'lodash';
import packageJson from '../package.json' with { type: 'json' };
import defaultsConfig from '../config/default.json' with { type: 'json' };

// ---------------------------
// Environment variables for prefixes
const CHANNEL = process.env.CHANNEL || 'production'; // production, alpha, beta, adhoc
const DISPLAY_NAME = process.env.DISPLAY_NAME || 'Signal';
const APP_NAME = process.env.APP_NAME || 'signal';
const DOMAIN = process.env.DOMAIN || 'org.whispersystems';
const UPDATE_URL = process.env.UPDATE_URL || 'https://updates.signal.org/desktop';

// ---------------------------
// Generate final names
const config = {
  name: `${APP_NAME}-${CHANNEL}`,
  productName: `${DISPLAY_NAME}`,
  appId: `${DOMAIN}.${APP_NAME}.${CHANNEL}`,
  wmClass: `${APP_NAME}-${CHANNEL}`,
  desktopName: `${APP_NAME}.desktop`,
  executableName: `${APP_NAME}-desktop-${CHANNEL}`,
  updateURL: `${UPDATE_URL}`,
};

// ---------------------------
// Update package.json dynamically
function updatePackageJson(pkg, cfg) {
  _.set(pkg, 'name', cfg.name);
  _.set(pkg, 'productName', cfg.productName);
  _.set(pkg, 'build.appId', cfg.appId);
  _.set(pkg, 'build.linux.desktop.entry.StartupWMClass', cfg.wmClass);
  _.set(pkg, 'desktopName', cfg.desktopName);
  _.set(pkg, 'build.linux.executableName', cfg.executableName);
  _.set(pkg, 'build.mac.publish.url', cfg.updateURL);
  _.set(pkg, 'build.win.publish.url', cfg.updateURL);
}

function updateDefaultsConfig(def, cfg) {
  _.set(def, 'updatesUrl', cfg.updateURL);
}

// ---------------------------
// Apply changes
console.log(`Preparing ${CHANNEL} build with prefixes:`);
console.log(JSON.stringify(config, null, 2));

updatePackageJson(packageJson, config);
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

console.log(`package.json updated for ${CHANNEL} build`);

updateDefaultsConfig(defaultsConfig, config);
fs.writeFileSync('./config/default.json', JSON.stringify(defaultsConfig, null, 2));

console.log(`defaultsConfig.js updated for ${CHANNEL} build`);

