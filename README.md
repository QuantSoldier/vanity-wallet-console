# Vanity Wallet Console

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
0xF01d62789f9c2902a844ab2CA4599E0Ed8e1FACE
0xB33F3DDd63439f0EdBBee2952Ac3204113554Fd8
0x88888819E533031366c7A04098f479333FBC2d62
```

## Settings

All config settings are found in the `.env` file

Logging Frequency - `STEPS` - default 10000, how many calculations before a logging message is emitted



*Buy me a coffee: ETH - 0xB33F3DDd63439f0EdBBee2952Ac3204113554Fd8*