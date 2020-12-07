const secp256k1 = require('secp256k1')
const keccak = require('keccak')
const { randomBytes } = require('crypto')
const { logAttempts, logPerformance } = require('./logs')

// return the generated public key from private key
const privateToPublic = (privateKey) => {
	const pubKey = secp256k1.publicKeyCreate(privateKey, false);
	return pubKey
}

// convert the public key buffer to ethereum address
const publicToAddress = (pubKey) => {
	const publicKey = Buffer.from(pubKey.slice(1)) // slice the 04 (uncompressed flag) byte from the public key
	return keccak('keccak256').update(publicKey).digest().slice(-20).toString('hex');
};

// generate a random wallet with keccak hashing algo
const getRandomWallet = () => {
	const privateKey = randomBytes(32) // create a random 32-length byte string, use it as PK
	const publicKey = privateToPublic(privateKey)
	const address = publicToAddress(publicKey)

	return {
		address: address.toString('hex'),
		privateKey: privateKey.toString('hex'),
		publicKey: Buffer.from(publicKey).toString('hex')
	};
};

// base validation
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

// double ended validation
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
	logFrequency,
	callback
) => {
	input = isChecksum ? input : input.toLowerCase();
	let wallet = getRandomWallet();
	let attempts = 1;
	let ts = logAttempts(attempts, input, isChecksum, logFrequency, new Date(Date.now()).getMilliseconds())
	await logPerformance()

	while (!isValidVanityAddress(wallet.address, input, isChecksum, isSuffix)) {
		if (attempts % logFrequency === 0) {
			ts = logAttempts(attempts, input, isChecksum, logFrequency, ts)
			await logPerformance()
		}
		wallet = getRandomWallet();
		attempts++;
	}
	callback({
		address: '0x' + toChecksumAddress(wallet.address),
		privKey: wallet.privateKey,
		pubKey: wallet.publicKey,
		attempts,
	});
};

const getDoubleVanityWallet = async (
	inputStart,
	inputEnd,
	isChecksum,
	logFrequency,
	callback
) => {
	inputStart = isChecksum ? inputStart : inputStart.toLowerCase();
	inputEnd = isChecksum ? inputEnd : inputEnd.toLowerCase();
	let wallet = getRandomWallet();
	let attempts = 1;

	const startTime = Date.now() / 1000
	let ts = logAttempts(attempts, inputStart + inputEnd, isChecksum, logFrequency, startTime)
	await logPerformance()

	while (!isValidDoubleVanityAddress(wallet.address, inputStart, inputEnd, isChecksum)) {
		if (attempts % logFrequency === 0) {
			const prev = ts
			ts = logAttempts(attempts, inputStart + inputEnd, isChecksum, logFrequency, prev)
			await logPerformance()
		}
		wallet = getRandomWallet();
		attempts++;
	}
	callback({
		address: '0x' + toChecksumAddress(wallet.address),
		privKey: wallet.privateKey,
		pubKey: wallet.publicKey,
		attempts,
	});
}

module.exports = {
	getVanityWallet,
	getDoubleVanityWallet
}
