const axios = require('axios');
const { appendFile } = require('fs').promises;
const { EOL } = require('os');

const processId = Number(process.argv[2]);
const processNum = 2;

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}


async function main() {
  let startTime = Date.now();
  for (let provinceCode = processId; provinceCode <= 64; provinceCode += processNum) {
    if ((Date.now() - startTime) >= (4 * 60 * 1000)) {
      await sleep(60 * 1000);
      startTime = Date.now()
    }
    let index = 0;
    let continueTimes = 0;
    console.log(provinceCode);
    while (continueTimes < 50) {
      index++;
      const code = String(provinceCode).padStart(2, '0') + String(index).padStart(6, '0');
      const response = await axios.get(`https://thanhnien.vn/ajax/diemthi.aspx?kythi=THPT&nam=2021&city=DDT&text=${code}&top=no`);
      console.log(code);
      if (!response.data.trim()) {
        continueTimes++
        console.log(response.data);
        continue;
      }
      continueTimes = 0;
      const data = response.data.match(/<tr>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<td[^\>]+>([^<>]*)<\/td>\s*<\/tr>/);
      appendFile(`data-${processId}.tsv`, data[4] + '\t' + data.slice(7).join('\t') + EOL)
    }
  }
}

main().then(() => {
  console.log("completed");
}).catch(e => {
  appendFile('error.txt', String(e));
  console.log(e);
})
