const path = require('path');
const fsPromises = require('fs/promises');

fsPromises.readdir(path.join(__dirname, './secret-folder')).then((files) => {
  for (const file of files) {
    console.log(file);
  }
});
