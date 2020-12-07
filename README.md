# Vanity Wallet Console

```
 __     __          _ _          __        __    _ _      _      ____                      _      
 \ \   / /_ _ _ __ (_) |_ _   _  \ \      / /_ _| | | ___| |_   / ___|___  _ __  ___  ___ | | ___ 
  \ \ / / _` | '_ \| | __| | | |  \ \ /\ / / _` | | |/ _ \ __| | |   / _ \| '_ \/ __|/ _ \| |/ _ \
   \ V / (_| | | | | | |_| |_| |   \ V  V / (_| | | |  __/ |_  | |__| (_) | | | \__ \ (_) | |  __/
    \_/ \__,_|_| |_|_|\__|\__, |    \_/\_/ \__,_|_|_|\___|\__|  \____\___/|_| |_|___/\___/|_|\___|
                          |___/                                                                   
```

Vanity Wallet Console allows you to generate Ethereum addresses with custom beginnings, endings, or both! This application runs in the terminal and is completely offline. All generated addresses are saved in `.txt` format to the current directory in the form `{address}.txt`. If a `keys/` folder exists in the directory this script was run in, the app will save the file there instead.

https://www.npmjs.com/package/vanity-wallet-console

## Usage

Install vanity-wallet-console globally from the NPM
```
npm install -g vanity-wallet-console
```

Then just run the command and follow the prompts to generate your vanity address!
```
vanity-wallet-console
```

## Examples

Here are some example addresses that have been generated with this app:

```
0x000000d397E6f21813CE8E7f1Ec9C0271185cA24
0xef933F4abC45392d777738ccB506c848c24Eface
0xB33F3DDd63439f0EdBBee2952Ac3204113554Fd8
0x8882868860de58fdBF6Def09E03f08c49Fc87888
```

## What is this application doing?

Ethereum addresses are generated through a series of mathematical operations. Ethereum uses an elliptic curve hashing algorithm called P-256K to generate public keys. Public keys are then hashed and checksummed to produce a final 20-byte (40 hexidecimal characters) long address.

1. Generate a random 32-length array of bytes. Use this byte array as the private key.  
2. Convert the byte array to hexidecimal string representation. Each byte is 8 bits of information, with each 4 bit half representing one hexidecimal character. 
3. Use the elliptic curve secp256k1 hashing algorithm to derive the public key.  
4. Derive the Ethereum address by converting the first significant 40 bytes to hexidecimal characters. Skip the first byte (always 0x04, denotes uncompressed version)
5. Run checks to see if the generated address matches the user input
6. If case sensitivity is enabled, validate that the address produces a valid ENS checksum. 

## Resources

- Vanity Eth: https://github.com/bokub/vanity-eth
- NodeJS Crypto: https://nodejs.org/api/crypto.html  
- Elliptic Curve Keys: http://davidederosa.com/basic-blockchain-programming/elliptic-curve-keys/
- EIP-55 (Checksums): https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
- PEM to JW: https://github.com/callstats-io/pem-to-jw  
- P-256K to PEM: https://gist.github.com/miguelmota/3793b160992b4ea0b616497b8e5aee2f  
- ECC RFC: https://tools.ietf.org/html/rfc5480  
- JWK RFC: https://self-issued.info/docs/draft-ietf-jose-json-web-key.html

<br/>

*Like this project? Buy me a coffee: ETH - 0xB33F3DDd63439f0EdBBee2952Ac3204113554Fd8*
