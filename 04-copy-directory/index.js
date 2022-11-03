const path = require('path');
const fsPromises = require('fs/promises');
const { resolve } = require('path');

const createDirectoryAsync = async (dir, newDir) => {
  return fsPromises.mkdir(newDir, { recursive: true });
};

const cleanDirectoryAsync = async (newDir) => {
  fsPromises.rm(newDir, { recursive: true, force: true });
};

const readFilesAsync = async (dir) => {
  return fsPromises.readdir(dir, {
    withFileTypes: true,
  });
};

const isDirectoryAsync = async (filepath) => {
  return (await fsPromises.stat(filepath)).isDirectory();
};

const copyFileAsync = async (filepath, newDir) => {
  return fsPromises.copyFile(filepath, newDir);
};

const copyFilesInDirectory = async (dir, newDir) => {
  await cleanDirectoryAsync(newDir);
  createDirectoryAsync(dir, newDir);
  const files = await readFilesAsync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file.name);
    const isDirectory = await isDirectoryAsync(filepath);
    if (!isDirectory) {
      copyFileAsync(filepath, path.join(newDir, file.name));
    } else {
      copyFilesInDirectory(filepath, path.join(newDir, file.name));
    }
  }
};

const dir = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');
//node 04-copy-directory

copyFilesInDirectory(dir, newDir);
