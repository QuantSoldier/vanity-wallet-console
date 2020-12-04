const inquirer = require('inquirer');

const VALID_HEX_CHARS = ['0123456789abcdefABCDEF']
const HAS_LETTER_REGEX = /[a-zA-Z]/g

const validateHexInput = (value, maxLen) => {
  if (!value) {
    return 'Please enter a value to proceed.'
  }
  if (value.length > maxLen) {
    return `Value exceeds max length of ${maxLen}`
  }
  value.split('').forEach((char) => {
    if (!VALID_HEX_CHARS.includes(char)) {
      return 'Please enter a valid hexidecimal prefix or suffix.'
    }
  })
  return true;
}

const validateLoggingInput = (value) => {
  if (value < 1) {
    return "Please choose a valid logging frequency."
  }
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
      validate: (value) => validateHexInput(value, 40)
    },
    {
      type: 'list',
      name: 'placement',
      message: 'Prefix or suffix:',
      choices: [ 'prefix', 'suffix' ],
      default: 'prefix',
    },
    {
      type: 'list',
      name: 'case',
      message: 'Case Sensitive:',
      choices: ['yes', 'no'],
      default: 'yes',
      when: (answers) => HAS_LETTER_REGEX.test(answers.input) 
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
      validate: (value) => validateHexInput(value)
    },
    {
      type: 'input',
      name: 'inputEnd',
      message: 'Enter the vanity suffix you would like to generate:',
      default: argv._[1],
      validate: (value) => validateHexInput(value)
    },
    {
      type: 'list',
      name: 'case',
      message: 'Case Sensitive:',
      choices: ['yes', 'no'],
      default: 'yes',
      when: (answers) => HAS_LETTER_REGEX.test(answers.inputStart) && HAS_LETTER_REGEX.test(answers.inputEnd) 
    }
  ]

  return inquirer.prompt(doubleInputs)
}

const getLoggingOptions = (difficulty) => {
  const argv = require('minimist')(process.argv.slice(2));
  const estimate = estimateLogFrequency(difficulty)
  console.log(argv)
  const logInputs = [
    {
      type: 'input',
      name: 'logFrequency',
      message: `Logging Frequency (Estimate ${estimate}, Press Enter for Default):`,
      default: argv._[0] || estimate,
      validate: (value) => validateLoggingInput(value)
    },
  ]

  return inquirer.prompt(logInputs)
}



module.exports = {
  getFunctionSelect,
  getSingleInputOptions,
  getDoubleInputOptions,
};