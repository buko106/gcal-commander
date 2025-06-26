#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable unicorn/prefer-module */

// Register ts-node for TypeScript support in development
require('ts-node/register');

// Initialize DI container before running commands
require('../src/di/container');

const {execute} = require('@oclif/core');

execute({development: true, dir: __dirname});
