const { basename, join } = require("path");
const md5 = require("blueimp-md5");
const path = require('path');
const getImportedCssFiles = require("./getImportedCssFiles");

module.exports = async function (code) {
  const cssPath = this.resourcePath;
  const cssFileName = basename(cssPath);
  const prefix = md5(cssPath);
  const { css, importedCssPaths } = getImportedCssFiles(code);

  const loadModule = (cssPath)=>{
    return new Promise((resolve, reject)=>{
      this.loadModule(cssPath, (err, source)=>{
        if(err) {
          reject(err);
        } else {
          resolve(source);
        }
      });
    });
  };

  const assetPath = join(
    "includedscripts",
    `${prefix}_${cssFileName}`
  );

  const promises = importedCssPaths.map((importedCssPath)=>loadModule(importedCssPath));

  const sources = await Promise.all(promises);

  sources.push(
    `
    (()=>{
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = '/assets/${assetPath}';
      document.head.appendChild(link);
    })();
    `
  );

  const ap = this.getOptions().assetPath || '';
  this.emitFile(path.join(ap, assetPath), css);

  return sources.join('\n\n');
};
