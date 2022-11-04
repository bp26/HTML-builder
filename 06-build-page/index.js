const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');
const readline = require('node:readline');

//Common
const readFiles = async (dir) => {
  return fsPromises.readdir(dir, {
    withFileTypes: true,
  });
};
const createDirectory = async (newDir) => {
  return fsPromises.mkdir(newDir, { recursive: true });
};
const cleanDirectory = async (newDir) => {
  return fsPromises.rm(newDir, { recursive: true }).catch((err) => {
    return null;
  });
};

//AssembleHtmlTemplate
const createEmptyTemplate = async (dist) => {
  return fsPromises.writeFile(path.join(dist, 'index.html'), '');
};

const assembleHtmlTemplateToDist = async (src, dist) => {
  await createDirectory(dist);
  await createEmptyTemplate(dist);
  const input = fs.createReadStream(src, 'utf-8');
  const output = fs.createWriteStream(path.join(dist, 'index.html'));
  const rl = readline.createInterface(input);
  rl.on('line', (line) => {
    if (line.includes('{{')) {
      const componentName = line.trim().slice(2, -2);
      const component = fs.createReadStream(
        path.join(__dirname, 'components', `${componentName}.html`)
      );
      component.pipe(output);
    } else {
      output.write(`${line}\n`);
    }
  });
};

const dist = path.join(__dirname, 'project-dist');
assembleHtmlTemplateToDist(path.join(__dirname, 'template.html'), dist);

//AssembleCssBundle
const isFile = async (filepath) => {
  const stats = await fsPromises.stat(filepath);
  return stats.isFile();
};
const isCss = (filepath) => {
  const extension = path.extname(filepath);
  return extension === '.css' ? true : false;
};
const createEmptyBundle = async (dist) => {
  return fsPromises.writeFile(path.join(dist, 'style.css'), '');
};
const assembleCssBundleToDist = async (src, dist) => {
  await createEmptyBundle(dist);
  const output = fs.createWriteStream(path.join(dist, 'style.css'));
  const files = await readFiles(src);
  for (const file of files) {
    const filepath = path.join(src, file.name);
    const isFileBoolean = await isFile(filepath);
    const isCssBoolean = isCss(filepath);
    if (isFileBoolean & isCssBoolean) {
      const input = fs.createReadStream(filepath, 'utf-8');
      input.pipe(output);
    }
  }
};

//CopyDirectory
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

//BuildPage
const buildPage = async () => {};

// node 06-build-page
