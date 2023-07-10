import http from "node:http";
import { Buffer } from "node:buffer";

const hecSuccess = {
  text: "Success",
  code: 0,
};

const server = http.createServer((req, res) => {
  if (req.method !== "POST") {
    res.writeHead(405);
    res.end();
  } else {
    let reqBuff = Buffer.alloc(0);
    req.on("data", (chunk) => {
      reqBuff = Buffer.concat([reqBuff, chunk]);
    });

    req.on("end", () => {
      const reqBody = reqBuff.toString();
      console.log(reqBody);

      const resBody = JSON.stringify(hecSuccess) + "\n";

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Length": resBody.length,
      });
      res.end(resBody);
    });
  }
});

server.listen(8088);
