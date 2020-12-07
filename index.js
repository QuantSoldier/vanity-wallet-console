#!/usr/bin/env node

//require('dotenv').config()
const clear = require("clear");
const chalk = require('chalk');

const { getVanityWallet, getDoubleVanityWallet } = require("./lib/vanity")
const { writeKeyFile, writeTxtFile, getFileContents } = require("./lib/file")
const { logTitle, getLogFrequency } = require("./lib/logs");
const { getFunctionSelect, getSingleInputOptions, getDoubleInputOptions } = require('./lib/prompts');
const { computeDifficulty } = require('./lib/stats');

// https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/

const onAddress = ({ address, privKey, pubKey, attempts }) => {
  console.log(
    chalk.whiteBright(`Found address ${address} after ${attempts} attempts.\n`)
  )
  
  try {
    writeKeyFile(address, privKey, pubKey)
    writeTxtFile(address, privKey, pubKey)
  } catch {
    console.log("Failed to write file. Fallback to logging key information:\n")
    console.log(chalk.yellow(`${getFileContents(address, privKey, pubKey)}\n`))
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
  console.log(chalk.yellow(`\nDifficulty of calculation: ${diff}\n`))

  // const logFrequency = process.env.NODE_ENV === 'development' ? Number(process.env.STEPS) : estimateLogFrequency(diff)
  const logFrequency = getLogFrequency(diff)
  console.log(`Logging after every ${logFrequency} address calculations`)
  // let fileName = "keys/{fileName}.json"

  console.log("Starting vanity address calculations...\n")
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
