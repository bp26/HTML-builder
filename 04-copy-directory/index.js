const path = require('path');
const fsPromises = require('fs/promises');

const createDirectory = async (newDir) => {
  return fsPromises.mkdir(newDir, { recursive: true });
};

const cleanDirectory = async (newDir) => {
  return fsPromises.rm(newDir, { recursive: true }).catch((err) => {
    return null;
  });
};

const readFiles = async (dir) => {
  return fsPromises.readdir(dir, {
    withFileTypes: true,
  });
};

const isDirectory = async (filepath) => {
  return (await fsPromises.stat(filepath)).isDirectory();
};

const copyFile = async (filepath, newDir) => {
  return fsPromises.copyFile(filepath, newDir);
};

const copyFilesInDirectory = async (dir, newDir) => {
  await cleanDirectory(newDir);
  createDirectory(newDir);
  const files = await readFiles(dir);
  for (const file of files) {
    const filepath = path.join(dir, file.name);
    const isDirectoryBoolean = await isDirectory(filepath);
    if (!isDirectoryBoolean) {
      copyFile(filepath, path.join(newDir, file.name));
    } else {
      copyFilesInDirectory(filepath, path.join(newDir, file.name));
    }
  }
};

const dir = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');

copyFilesInDirectory(dir, newDir);
