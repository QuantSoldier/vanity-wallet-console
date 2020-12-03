const secp256k1 = require('secp256k1')
const keccak = require('keccak')
const crypto = require('crypto');
const { logAttempts, logPerformance } = require('./logs');

// const step = 500;

const privateToAddress = (privateKey) => {
    const pub = secp256k1.publicKeyCreate(privateKey, false).slice(1);
    return keccak('keccak256').update(Buffer.from(pub)).digest().slice(-20).toString('hex');
};

const getRandomWallet = () => {
    const randbytes = crypto.randomBytes(32)
    return {
        address: privateToAddress(randbytes).toString('hex'),
        privKey: randbytes.toString('hex')
    };
};

const isValidVanityAddress = (address, input, isChecksum, isSuffix) => {
    const subStr = isSuffix ? address.substr(40 - input.length) : address.substr(0, input.length);

    if (!isChecksum) {
        return input === subStr;
    }
    if (input.toLowerCase() !== subStr) {
        return false;
    }

    return isValidChecksum(address, input, isSuffix);
};

const isValidDoubleVanityAddress = (address, inputStart, inputEnd, isChecksum) => {
  const subStrStart = address.substr(0, inputStart.length);
  const subStrEnd = address.substr(40 - inputEnd.length);

  if (!isChecksum) {
      return inputStart === subStrStart && inputEnd === subStrEnd;
  }
  if (inputStart.toLowerCase() !== subStrStart || inputEnd.toLowerCase() !== subStrEnd) {
      return false;
  }

  return isValidChecksum(address, inputStart, false) && isValidChecksum(address, inputEnd, true);
};

const isValidChecksum = (address, input, isSuffix) => {
    const hash = keccak('keccak256').update(address).digest().toString('hex');
    const shift = isSuffix ? 40 - input.length : 0;

    for (let i = 0; i < input.length; i++) {
        const j = i + shift;
        if (input[i] !== (parseInt(hash[j], 16) >= 8 ? address[j].toUpperCase() : address[j])) {
            return false;
        }
    }
    return true;
};

const toChecksumAddress = (address) => {
    const hash = keccak('keccak256').update(address).digest().toString('hex');
    let ret = '';
    for (let i = 0; i < address.length; i++) {
        ret += parseInt(hash[i], 16) >= 8 ? address[i].toUpperCase() : address[i];
    }
    return ret;
};

const getVanityWallet = async (
    input, 
    isChecksum, 
    isSuffix, 
    callback
) => {
    input = isChecksum ? input : input.toLowerCase();
    let wallet = getRandomWallet();
    let attempts = 1;
    let ts = logAttempts(attempts, input, isChecksum, new Date(Date.now).getMilliseconds())
    await logPerformance()

    while (!isValidVanityAddress(wallet.address, input, isChecksum, isSuffix)) {
        if (attempts % process.env.STEPS === 0) {
            ts = logAttempts(attempts, input, isChecksum, ts)
            await logPerformance()
        }   
        wallet = getRandomWallet();
        attempts++;
    }
    callback({address: '0x' + toChecksumAddress(wallet.address), privKey: wallet.privKey, attempts});
};

const getDoubleVanityWallet = async (
    inputStart, 
    inputEnd, 
    isChecksum, 
    callback
) => {
  inputStart = isChecksum ? inputStart : inputStart.toLowerCase();
  inputEnd = isChecksum ? inputEnd : inputEnd.toLowerCase();
  let wallet = getRandomWallet();
  let attempts = 1;
  let ts = logAttempts(attempts, inputStart+inputEnd, isChecksum, new Date(Date.now).getMilliseconds())
  await logPerformance()

  while (!isValidDoubleVanityAddress(wallet.address, inputStart, inputEnd, isChecksum)) {
    if (attempts % process.env.STEPS === 0) {
        ts = logAttempts(attempts, inputStart+inputEnd, isChecksum, ts)
        await logPerformance()
    }
    wallet = getRandomWallet();
    attempts++;
  }
  callback({address: '0x' + toChecksumAddress(wallet.address), privKey: wallet.privKey, attempts});
}

module.exports = {
    getVanityWallet,
    getDoubleVanityWallet
}
