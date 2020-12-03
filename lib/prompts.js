const inquirer = require('inquirer');

const VALID_HEX_CHARS = ['0123456789abcdefABCDEF']

const validateHexInput = (value) => {
  if (!value) {
    return 'Please enter a value to proceed.'
  }
  value.split('').forEach((char) => {
    if (!VALID_HEX_CHARS.includes(char)) {
      return 'Please enter a valid hexidecimal prefix or suffix.'
    }
  })
  return true;
}

const getFunctionSelect = () => {
  const functionSelect = [
    {
      type: 'list',
      name: 'mode',
      message: 'Single or Double-Ended Vanity Address:',
      choices: [ 'single', 'double' ],
      default: 'single'
    }
  ]
  
  return inquirer.prompt(functionSelect); 
}

const getSingleInputOptions = () => {
  const argv = require('minimist')(process.argv.slice(2));

  const singleInputs = [
    {
      type: 'input',
      name: 'input',
      message: 'Enter the vanity prefix/suffix you would like generate:',
      default: argv._[0],
      // when: (answers) => answers.function === "single",
      validate: (value) => validateHexInput(value)
    },
    {
      type: 'list',
      name: 'placement',
      message: 'Prefix or suffix:',
      choices: [ 'prefix', 'suffix' ],
      default: 'prefix',
      // when: (answers) => answers.function === "single",
    },
    {
      type: 'list',
      name: 'case',
      message: 'Case Sensitive:',
      choices: ['yes', 'no'],
      default: 'yes'
    }
  ]
  return inquirer.prompt(singleInputs)
}

const getDoubleInputOptions = () => {
  const argv = require('minimist')(process.argv.slice(2));

  const doubleInputs = [
    {
      type: 'input',
      name: 'inputStart',
      message: 'Enter the vanity prefix you would like to generate:',
      default: argv._[0],
      // when: (answers) => answers.function === "double",
      validate: (value) => validateHexInput(value)
    },
    {
      type: 'input',
      name: 'inputEnd',
      message: 'Enter the vanity suffix you would like to generate:',
      default: argv._[1],
      // when: (answers) => answers.function === "double",
      validate: (value) => validateHexInput(value)
    },
    {
      type: 'list',
      name: 'case',
      message: 'Case Sensitive:',
      choices: ['yes', 'no'],
      default: 'yes'
    }
  ]

  return inquirer.prompt(doubleInputs)
}



module.exports = {
  getFunctionSelect,
  getSingleInputOptions,
  getDoubleInputOptions
};