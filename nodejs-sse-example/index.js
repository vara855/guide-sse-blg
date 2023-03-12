let http = require("http");
let url = require("url");
let querystring = require("querystring");

function onDigits(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
  });

  let i = 0;

  let timer = setInterval(write, 1000);
  write();

  function write() {
    i++;

    if (i == 10) {
      res.write("event: bye\ndata: bye-bye\n\n");
      clearInterval(timer);
      res.end();
      return;
    }

    console.log(`produced number ${i}`);
    res.write(`data: Event #${i}\n\n`);
  }
}

function onRoot(req, res) {
  res.write(JSON.stringify({ status: "OK" }));
  res.end();
}

function accept(req, res) {
  if (req.url == "/") {
    onRoot();
  }
  if (req.url == "/digits") {
    onDigits(req, res);
    return;
  }
  res.write("not found");
  res.end();
}

http
  .createServer(accept)
  .listen(8080, () => console.log("listening on port " + 8080))
  .on("error", (e) => {
    console.error(e);
    process.exit(1);
  });
