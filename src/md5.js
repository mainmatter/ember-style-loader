const fs = require("fs");
const crypto = require("crypto");

module.exporst = function (filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5");
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("data", (data) => {
      hash.update(data);
    });

    fileStream.on("end", () => {
      const md5Hash = hash.digest("hex");
      resolve(md5Hash);
    });

    fileStream.on("error", (error) => {
      reject(error);
    });
  });
}
