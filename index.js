#!/usr/bin/env node

require('dotenv').config()
const clear = require("clear");

const { getVanityWallet, getDoubleVanityWallet } = require("./lib/vanity")
const { writeKeyFile } = require("./lib/file")
const { logTitle } = require("./lib/logs");
const { getFunctionSelect, getSingleInputOptions, getDoubleInputOptions } = require('./lib/prompts');
const chalk = require('chalk');

// https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/

const onAddress = ({ address, privKey, attempts }) => {
  console.log(`Found address ${address} after ${attempts} attempts.`)
  
  try {
    writeKeyFile(address, privKey)
  } catch {
    console.log("Failed to write file. Fallback to logging key information:\n")
    const ts = new Date(Date.now())
    console.log(chalk.yellow(`[${ts.toUTCString()}]\nAddress: ${address}\nPrivate Key: ${privKey}\n`))
  }

  console.timeEnd('Total Time Elapsed')
}

const main = async () => {
  clear()
  logTitle()

  let values
  const selection = await getFunctionSelect()
  if (selection.mode === 'single') {
    values = await getSingleInputOptions()
  } else {
    values = await getDoubleInputOptions()
  }
  
  const input = values.input || undefined
  const inputStart = values.inputStart || undefined
  const inputEnd = values.inputEnd || undefined
  const isChecksum = values.case === false
  const isSuffix = values.placement === 'suffix'
  // let fileName = "keys/{fileName}.json"

  console.log("Starting vanity address hash calculations...")
  console.time("Total Time Elapsed")  
  if (input) {
    getVanityWallet(input, isChecksum, isSuffix, onAddress)
  } else if (inputStart && inputEnd) {
    getDoubleVanityWallet(inputStart, inputEnd, isChecksum, onAddress)
  } else {
    throw Error("An unhandled exception occurred. Could not get vanity address");
  }
}

main()