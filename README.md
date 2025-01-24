# Node.js Password Generator CLI

Command-line interface (CLI) tool for generating secure passwords. The tool supports optional character sets, allowing to create passwords with a mix of letters, numbers, and special characters.

## Features

- **Customizable Password Length**: Specify password lengths between 8 and 64 characters.
- **Optional Character Sets**: Include uppercase letters, numbers, and special characters in the password.
- **Validation**: Ensures at least one character from each selected character set is included in the password.

## Installation Requirements

Make sure you have [Node.js](https://nodejs.org/) installed.

1. Clone this repository or copy the script.
2. Run the tool using `npm run` or `node` in your terminal.

```bash
npm run passgen [options]
node index.js [options]
```

## Usage
Option prefixes (required, can me mixed in any way): `--`, `-`, `/`

Display Help: `help`, `h`, `?`  
Password length (8-64, default 8): `length <number>`, `len <number>`, `l <number>`  
Include uppercase characters (by default, only lowercase is used): `uppercase`, `upper`, `u`  
Include numbers (0-9) : `numbers`, `num`, `n`  
Include special characters: `special`, `spec`, `s`  

Example:
```bash
node index.js --u /len 16 -numbers
```
```bash
node index.js /help
```
```bash
node index.js --n /length 32
```
