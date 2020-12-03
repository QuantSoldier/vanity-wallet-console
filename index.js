#!/usr/bin/env node

require('dotenv').config()
const clear = require("clear");

const { getVanityWallet, getDoubleVanityWallet } = require("./lib/vanity")
const { writeKeyFile } = require("./lib/file")
const { logTitle, estimateLogFrequency } = require("./lib/logs");
const { getFunctionSelect, getSingleInputOptions, getDoubleInputOptions } = require('./lib/prompts');
const chalk = require('chalk');
const { computeDifficulty } = require('./lib/stats');

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

  let input = values.input || undefined
  let inputStart = values.inputStart || undefined
  let inputEnd = values.inputEnd || undefined
  let isChecksum = values.case === 'yes'
  let isSuffix = values.placement === 'suffix'

  const diff = input 
  ? computeDifficulty(input, isChecksum) 
  : computeDifficulty(inputStart+inputEnd, isChecksum)

  const logFrequency = process.env.STEPS ? Number(process.env.STEPS) : estimateLogFrequency(diff)
  console.log(logFrequency)
  
  // let fileName = "keys/{fileName}.json"

  console.log("Starting vanity address hash calculations...")
  console.time("Total Time Elapsed")  
  if (input) {
    await getVanityWallet(input, isChecksum, isSuffix, logFrequency, onAddress)
  } else if (inputStart && inputEnd) {
    await getDoubleVanityWallet(inputStart, inputEnd, isChecksum, logFrequency, onAddress)
  } else {
    throw Error("An unhandled exception occurred. Could not get vanity address");
  }
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
})