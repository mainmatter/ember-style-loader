const { basename, join } = require("path");
const md5 = require("./md5");

module.exports = async function (code) {
  const cssPath = this.resourcePath;
  const cssFileName = basename(cssPath);
  const prefix = md5(cssPath);
  const assetPath = join(
    "/assets",
    "includedscripts",
    `${prefix}_${cssFileName}`
  );

  this.emitFile(assetPath, code);

  return `
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = '${assetPath}';
  document.head.appendChild(link);
  `;
};
