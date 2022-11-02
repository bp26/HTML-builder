const readline = require('node:readline');
const fs = require('fs');
const path = require('path');
const { stdin } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const readlineInterface = readline.createInterface(stdin);

console.log('Введите текст в консоль:');

readlineInterface.on('line', (line) => {
  line === 'exit' ? readlineInterface.close() : output.write(line);
});
readlineInterface.on('SIGINT', () => {
  readlineInterface.close();
});
readlineInterface.on('close', () => {
  console.log('Прощайте');
});
