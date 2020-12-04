const chalk = require('chalk');
const figlet = require('figlet')
var osu = require('node-os-utils')
var cpu = osu.cpu
var mem = osu.mem
const { computeDifficulty, computeProbability } = require('./stats')

const estimateLogFrequency = (difficulty) => {
  if (difficulty <= 100000) {
    return 10000
  } else if (difficulty <= 10000000) {
    return 100000
  } else {
    return 1000000
  }

  // // round down to nearest magnitude - 1
  // const order = Math.floor(Math.log(difficulty) / Math.LN10)
  // return Math.pow(10, order-1);
}

const logTitle = () => {
  console.log(chalk.cyanBright(figlet.textSync('\t\tVanity Wallet', { horizontalLayout: 'controlled smushing' })))
  // console.log(chalk.magenta(figlet.textSync('Wallet', { horizontalLayout: 'controlled smushing' })))
  console.log(chalk.green(figlet.textSync('Console', { horizontalLayout: 'controlled smushing' })))
  console.log(
    chalk.whiteBright([
      "Wecome to Vanity Console. Be the envy of all your friends when you send them your custom Ethereum addresses.",
      "This app calculates the address and private key of an ethereum address with the specified beginning,",
      "ending, or both!"
    ].join(' '))
  )
  
  console.log(chalk.yellow("\n* NOTICE: Creating complex vanity addresses is a computationally heavy task!\n"))
}

const getTimestamp = () => {
  const ts = new Date(Date.now())
  return ts
}

const logAttempts = (attempts, input, isChecksum, logFrequency, lastTimestamp) => {
  const ts = getTimestamp()
  console.log(chalk.bold(`[${ts.toUTCString()}] Attempt #${attempts}`))
  const diff = computeDifficulty(input, isChecksum)
  const prob = computeProbability(diff, attempts)
  const seconds = Date.now() / 1000
  const elapsed = lastTimestamp ? seconds - lastTimestamp : 0;
  const calcRate = elapsed > 0 ? logFrequency / elapsed : 0;

  console.log(
    chalk.green([
      `Probability: ${(prob * 100).toFixed(2)}% |`,
      `Address/sec: ${calcRate.toFixed(2)}`,
    ].join(' '))
  )
  return seconds
}

const logPerformance = async () => {
  const values = await Promise.all([
    cpu.usage(),
    mem.info(),
    cpu.loadavg()
  ])
  const cpuLoadAvgs = values[2]

  console.log(
    chalk.cyan([
      `CPU Usage: ${values[0]}% |`,
      `Free System Memory: ${values[1].freeMemPercentage}%`,
    ].join(' '))
  )
  console.log(
    chalk.blue([
      `CPU 1M Load AVG: ${cpuLoadAvgs[0].toFixed(2)}% |`,
      `CPU 5M Load AVG: ${cpuLoadAvgs[1].toFixed(2)}% |`,
      `CPU 15M Load AVG: ${cpuLoadAvgs[2].toFixed(2)}%\n`
    ].join(' '))
  )
}


module.exports = {
  logTitle,
  logAttempts,
  logPerformance,
  estimateLogFrequency
}