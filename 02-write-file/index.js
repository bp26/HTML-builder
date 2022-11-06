const readline = require('node:readline');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { stdin } = process;

const filepath = path.join(__dirname, 'text.txt');
const readlineInterface = readline.createInterface(stdin);

const initFile = async (filepath) => {
  return fsPromises.access(filepath, fs.constants.F_OK).catch(() => {
    fsPromises.writeFile(filepath, '', (err) => {
      if (err) throw err;
    });
  });
};

const appendToFile = async (line) => {
  return fsPromises.appendFile(filepath, `${line}\n`, (err) => {
    if (err) throw err;
  });
};

console.log('Hello. Enter text in the console:');

readlineInterface.on('line', (line) => {
  line.trim() === 'exit'
    ? process.exit()
    : initFile(filepath).then(() => appendToFile(line));
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  console.log('Goodbye');
});
