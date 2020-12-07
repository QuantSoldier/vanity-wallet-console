const assert = require('assert')
const secp256k1 = require('secp256k1')
const KeyEncoder = require('key-encoder').default 
const { getVanityWallet, getDoubleVanityWallet } = require('../lib/vanity')

describe('Vanity', () => {
  it('should generate correct single address', async () => {
    const input = "00"
    await getVanityWallet(input, false, false, 1000000, ({address, privKey, pubKey}) => {
      assert(address.slice(2).startsWith(input))
      assert(secp256k1.privateKeyVerify(Buffer.from(privKey, 'hex')))
      assert(secp256k1.publicKeyVerify(Buffer.from(pubKey, 'hex')))
    })
  })
  it('should generate correct double address', async () => {
    const inputStart = "0"
    const inputEnd = "0"
    await getDoubleVanityWallet(inputStart, inputEnd, false, 1000000, ({address, privKey, pubKey}) => {
      assert(address.slice(2).startsWith(inputStart))
      assert(address.endsWith(inputEnd))
      assert(secp256k1.privateKeyVerify(Buffer.from(privKey, 'hex')))
      assert(secp256k1.publicKeyVerify(Buffer.from(pubKey, 'hex')))
    })
  })
  it('should generate correct checksum address', async () => {
    const inputStart = "A"
    const inputEnd = "A"
    await getDoubleVanityWallet(inputStart, inputEnd, true, 1000000, ({address, privKey, pubKey}) => {
      assert(address.slice(2).startsWith(inputStart))
      assert(address.endsWith(inputEnd))
      assert(secp256k1.privateKeyVerify(Buffer.from(privKey, 'hex')))
      assert(secp256k1.publicKeyVerify(Buffer.from(pubKey, 'hex')))
    })
  })
  it('should output valid public key', async () => {
    const input = "00"
    await getVanityWallet(input, false, false, 1000000, ({privKey, pubKey}) => {
      const buffer = Buffer.from(privKey, 'hex')
      const generated = secp256k1.publicKeyCreate(buffer, false)
      assert(Buffer.from(generated).toString('hex') === pubKey)
    }) 
  })
  it('should write a valid pem file', async () => {
    const input = "00"
    await getVanityWallet(input, false, false, 1000000, ({privKey, pubKey}) => {
      const keyEncoder = new KeyEncoder('secp256k1')
      const pem = keyEncoder.encodePrivate(privKey, 'raw', 'pem')
      const raw = keyEncoder.encodePrivate(pem, 'pem', 'raw')
      assert(raw === privKey)
    }) 
  })
})