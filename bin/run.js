#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable unicorn/prefer-module */

// Initialize DI container before running commands
require('../dist/di/container');

const {execute} = require('@oclif/core')

execute({dir: __dirname})
