const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(
  path.join(__dirname, './text.txt'),
  'utf-8'
);
let text = '';
readStream.on('data', (part) => {
  text += part;
});
readStream.on('end', () => {
  console.log(text);
});
