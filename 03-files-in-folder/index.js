const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

const readFilesPromise = (path) => {
  return fsPromises.readdir(path, {
    withFileTypes: true,
  });
};

const getStatsPromise = (filepath) => {
  return fsPromises.stat(filepath);
};

const isFile = (stats) => {
  return stats.isFile();
};

const getFilename = (filepath) => {
  return path.parse(filepath).name;
};

const getExtension = (filepath) => {
  return path.extname(filepath).split('.')[1];
};

const getSize = (stats) => {
  const bytes = stats.size;
  const kb = bytes / 1000;
  return `${kb}kb`;
};

readFilesPromise(path.join(__dirname, './secret-folder')).then((files) => {
  for (const file of files) {
    const filepath = path.join(__dirname, 'secret-folder', file.name);
    getStatsPromise(filepath).then((stats) => {
      if (isFile(stats)) {
        console.log(
          `${getFilename(filepath)} - ${getExtension(filepath)} - ${getSize(
            stats
          )}`
        );
      }
    });
  }
});
