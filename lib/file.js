const chalk = require('chalk');
const fs = require('fs');
// var argv = require('minimist')(process.argv.slice(2));
// var file = fs.readFileSync('data/' + argv.file, 'utf8');

const writeKeyFile = (address, privKey) => {
  console.log('Writing wallet information to disk...')

  const ts = new Date(Date.now())
  // const filePath = `${process.env.NODE_PATH}${address}.txt`
  let filePath
  if (fs.existsSync(`${process.cwd()}/keys/`)) {
    filePath = `${process.cwd()}/keys/${address}.txt`
  } else {
    filePath = `${process.cwd()}/${address}.txt`
  }

  fs.openSync(filePath, 'w')
  fs.writeFileSync(
    filePath,
    `[${ts.toUTCString()}]\nAddress: ${address}\nPrivate Key: ${privKey}\n`,
    'utf-8'
  )
  // console.log()
  console.log(chalk.green('Key file saved to:'), chalk.bold(filePath))
}

module.exports = {
  writeKeyFile
}