const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');

//Common
const readFile = async (filepath) => {
  return fsPromises.readFile(filepath, 'utf-8');
};
const readDirectory = async (dir) => {
  return fsPromises.readdir(dir, {
    withFileTypes: true,
  });
};
const createDirectory = async (newDir) => {
  return fsPromises.mkdir(newDir, { recursive: true });
};
const cleanDirectory = async (dir) => {
  return fsPromises.rm(dir, { recursive: true }).catch((err) => {
    return null;
  });
};
const createWriteStream = async (filepath) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(filepath);
    resolve(output);
  });
};

//AssembleHtmlTemplate
const getComponents = async (compDir) => {
  const componentFiles = await readDirectory(compDir);
  return componentFiles.reduce(async (prevPromise, file) => {
    if (file.name.slice(-5) === '.html') {
      const arr = await prevPromise;
      const name = `{{${file.name.slice(0, -5)}}}`;
      const data = await readFile(path.join(compDir, file.name));
      const component = { name, data };
      return [...arr, component];
    }
  }, Promise.resolve([]));
};
const getFullTemplate = (templateData, components) => {
  let data = templateData;
  components.forEach((component) => {
    if (data.includes(component.name)) {
      let search = new RegExp(component.name, 'g');
      let newData = data.replace(search, component.data);
      data = newData;
    }
  });
  checkMissingComponents(templateData, components);
  return data;
};
const checkMissingComponents = (data, components) => {
  const regExp = /{{[a-z]*}}/gm;
  const matches = data.matchAll(regExp);
  for (const match of matches) {
    const filteredComponent = components.find(
      (component) => component.name === match[0]
    );
    if (!filteredComponent) {
      console.log(
        `Добавьте компонент ${match[0].slice(2, -2)} в папку components`
      );
    }
  }
};
const assembleHtmlTemplateToDist = async (src, compDir, dist) => {
  const output = await createWriteStream(path.join(dist, 'index.html'));
  const components = await getComponents(compDir);
  const templateData = await readFile(src);
  const fullTemplate = getFullTemplate(templateData, components);
  output.write(fullTemplate);
  output.end();
};

//AssembleCssBundle
const isFile = async (filepath) => {
  const stats = await fsPromises.stat(filepath);
  return stats.isFile();
};
const isCss = (filepath) => {
  const extension = path.extname(filepath);
  return extension === '.css' ? true : false;
};
const assembleCssBundleToDist = async (src, dist) => {
  const output = await createWriteStream(path.join(dist, 'style.css'));
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
  output.end();
};

//CopyDirectory
const isDirectory = async (filepath) => {
  return (await fsPromises.stat(filepath)).isDirectory();
};
const copyFile = async (filepath, newDir) => {
  return fsPromises.copyFile(filepath, newDir);
};
const copyFilesInDirectory = async (dir, newDir) => {
  await createDirectory(newDir);
  const files = await readDirectory(dir);
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
const buildPage = async (dist) => {
  await cleanDirectory(dist);
  await createDirectory(dist);
  await assembleHtmlTemplateToDist(
    path.join(__dirname, 'template.html'),
    path.join(__dirname, 'components'),
    dist
  );
  await assembleCssBundleToDist(path.join(__dirname, 'styles'), dist);
  copyFilesInDirectory(
    path.join(__dirname, 'assets'),
    path.join(dist, 'assets')
  );
};

const dist = path.join(__dirname, 'project-dist');
buildPage(dist);
