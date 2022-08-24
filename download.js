const fs = require('fs');
const events = require('events');
const Downloader = require("nodejs-file-downloader");
const readline = require('readline');
const delay = require('delay');
const { exec } = require('node:child_process')
const os = require('os');

const TARGET_DIR= process.cwd() + "/data";

const downloadFile = async (url) => {
  const [country, state, city, date, ...rest] = url.substring(29).split('/');
  const directory = `${TARGET_DIR}/${date.substring(0,7)}/${country}_${state}_${city}`;
  const downloadedFile = rest.pop();

  const downloader = new Downloader({
    url, //If the file name already exists, a new file with the name 200MB1.zip is created.
    directory: TARGET_DIR, //This folder will be created, if it doesn't exist.
    onError: function (error) {
      //You can also hook into each failed attempt.
      console.log("Error from attempt ", error);
    },
  });

  !fs.existsSync(directory) && fs.mkdirSync(directory, { recursive: true });

  try {
    await downloader.download(); //Downloader.download() resolves with some useful properties.
    fs.appendFileSync("success.log", url + os.EOL);
    fs.renameSync(`${TARGET_DIR}/${downloadedFile}`, `${directory}/${downloadedFile}`);
    exec(`gzip -d ${directory}/${downloadedFile}`);
  } catch (error) {
    //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
    //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
    // console.log("Download failed : ", url);
    console.log(error);
    fs.appendFileSync("failed.log", url + os.EOL);
    fs.appendFileSync("failed_error.log", error + os.EOL);

  }

};

const links = [];

(async function processLineByLine() {
  try {
    
    const rl = readline.createInterface({
      input: fs.createReadStream('links.txt'),
      crlfDelay: Infinity
    });

    rl.on('line', async (line) => {
      links.push(line);
    });

    await events.once(rl, 'close')  ;

    for (let index = 0; index < links.length; index++) {
      const link = links[index];
      await downloadFile(link);
      await delay(1000);
    }

  } catch (err) {
    console.error(err);
  }
})();