const readline = require('node:readline');
const fs = require('fs');
const path = require('path');
const { stdin } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const readlineInterface = readline.createInterface(stdin);

console.log('Hello. Enter text in the console:');

readlineInterface.on('line', (line) => {
  line === 'exit' ? process.exit() : output.write(`${line}\n`);
});
process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => {
  console.log('Goodbye');
});
