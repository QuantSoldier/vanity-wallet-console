# Vanity Console

Vanity Console allows you to generate Ethereum addresses with custom beginnings, endings, or both! This application runs in the terminal and is completely offline. All generated addresses are saved in `.txt` format to the current directory in the form `{address}.txt`. If a `keys/` folder exists in the directory this script was run in, the app will save the file there instead.

## Installing

Install vanity-console from NPM
```
npm install -g vanity-console
```

Then just run the command globally and follow the prompts
```
vanity-console
```

## Settings

All config settings are found in the `.env` file

Logging Frequency - `STEPS` - default 10000, how many calculations before a logging message is emitted