const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

const readFile = async (filepath) => {
  return fsPromises.readFile(filepath, 'utf-8');
};

const readDirectory = async (dir) => {
  return fsPromises.readdir(dir, {
    withFileTypes: true,
  });
};

const isFile = async (filepath) => {
  const stats = await fsPromises.stat(filepath);
  return stats.isFile();
};

const isCss = (filepath) => {
  const extension = path.extname(filepath);
  return extension === '.css' ? true : false;
};

const assembleBundleToDist = async (src, dist) => {
  const output = fs.createWriteStream(path.join(dist, 'bundle.css'));
  const files = await readDirectory(src);
  for (const file of files) {
    const filepath = path.join(src, file.name);
    const isFileBoolean = await isFile(filepath);
    const isCssBoolean = isCss(filepath);
    if (isFileBoolean & isCssBoolean) {
      const data = await readFile(filepath);
      output.write(data);
    }
  }
};

const src = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist');

assembleBundleToDist(src, dist);
