const chalk = require('chalk')
const fs = require('fs')
const { getTimestamp } = require('./logs')
const KeyEncoder = require('key-encoder').default

const getFileContents = (address, privKey, pubKey) => {
  return [
    `${getTimestamp()}`,
    `Address: ${address}`,
    `Private Key: ${privKey}`,
    `Public Key: ${pubKey}`
  ].join('\n')
}

const writeTxtFile = (address, privKey, pubKey) => {
  console.log('Writing wallet information to disk...')

  let filePath
  if (fs.existsSync(`${process.cwd()}/keys/`)) {
    filePath = `${process.cwd()}/keys/${address}.txt`
  } else {
    filePath = `${process.cwd()}/${address}.txt`
  }

  fs.openSync(filePath, 'w')
  fs.writeFileSync(
    filePath,
    getFileContents(address, privKey, pubKey),
    'utf-8'
  )
  // console.log()
  console.log(
    chalk.green('Readable key .txt file saved to:'), 
    chalk.bold(`${filePath}\n`)
  )
}

const writeKeyFile = (address, privKey, pubKey) => {
  console.log('Writing private key information to disk...')  
  
  let filePath
  if (fs.existsSync(`${process.cwd()}/keys/`)) {
    filePath = `${process.cwd()}/keys/${address}.pem`
  } else {
    filePath = `${process.cwd()}/${address}.pem`
  }

  const keyEncoder = new KeyEncoder('secp256k1')
  const pem = keyEncoder.encodePrivate(privKey.toString('hex'), 'raw' ,'pem').toString()

  fs.openSync(filePath, 'w')
  fs.writeFileSync(
    filePath,
    pem,
    'utf-8'
  )

  console.log(
    chalk.green('Private key .pem file saved to:'), 
    chalk.bold(`${filePath}\n`)
  )
}

module.exports = {
  getFileContents,
  writeTxtFile,
  writeKeyFile
}