const fs = require('fs');

const readFile = async(filePath: string) =>  {
  const data = await fs.readFileSync(filePath);
  return JSON.parse(data);
}

export {
  readFile
}