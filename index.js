const express = require("express");
require("dotenv").config();
const fs = require("fs");
const status = require("express-status-monitor");
const zlib = require("zlib");

const app = express();

app.use(status());

const port = process.env.PORT || 3098;

// const streamWıthZıp = fs // sample.txt'yi zipe çeviriyor.
//   .createReadStream("/.sample.txt")
//   .pipe(zlib.createGzip().pipe(fs.createWriteStream("./sample.zip")));



// tekte indir memory patlayıyor
app.get("/", (req, res) => {
  fs.readFile("./sample.zip", (err, data) => {
    console.log(data);
    res.end(data);
  });
});

// stream ile ver buda cok büyükte memory patlattı valla
app.get("/stream", (req, res) => {
  const stream = fs.createReadStream("./sample.txt", {
    encoding: "utf-8",
    highWaterMark: 32 * 1024,
  }); // 32kb'ye böl ,default 64 kb
  stream.on("data", (chunk) => res.write(chunk)); // chunkları alır ve geldikçe yazar
  stream.on("end", () => res.end()); // son chunk alınınca end çalışır biter.
});

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
