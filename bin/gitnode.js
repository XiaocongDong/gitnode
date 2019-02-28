#!/usr/bin/env node
(() => {
  // wrap in IIFE to be able to use return
  
  const importLocal = require('import-local')

  // Prefer the local installation of gitnode
  if (importLocal(__filename)) {
    return
  }

  const yargs = require('yargs')
  yargs
    .command(require('../src/init'))
    .command(require('../src/add'))
    .help()
    .argv
})()
