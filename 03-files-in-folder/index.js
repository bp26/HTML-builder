const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

const readFilesAsync = async (path) => {
  return fsPromises.readdir(path, {
    withFileTypes: true,
  });
};

const getStatsAsync = async (filepath) => {
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

const outputInformationAsync = async (dir) => {
  const files = await readFilesAsync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file.name);
    const stats = await getStatsAsync(filepath);
    if (isFile(stats)) {
      console.log(
        `${getFilename(filepath)} - ${getExtension(filepath)} - ${getSize(
          stats
        )}`
      );
    }
  }
};

outputInformationAsync(path.join(__dirname, 'secret-folder'));
