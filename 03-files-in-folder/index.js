const path = require('path');
const fsPromises = require('fs/promises');

const readFiles = async (path) => {
  return fsPromises.readdir(path, {
    withFileTypes: true,
  });
};

const getStats = async (filepath) => {
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

const outputInformation = async (dir) => {
  const files = await readFiles(dir);
  for (const file of files) {
    const filepath = path.join(dir, file.name);
    const stats = await getStats(filepath);
    if (isFile(stats)) {
      console.log(
        `${getFilename(filepath)} - ${getExtension(filepath)} - ${getSize(
          stats
        )}`
      );
    }
  }
};

const dir = path.join(__dirname, 'secret-folder');
outputInformation(dir);
