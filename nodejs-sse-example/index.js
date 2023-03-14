const http = require("http");
const { setInterval } = require("node:timers/promises");

function createSseEvent(data) {
  return `data: ${data}\n\n`;
}
const routes = new Map([
  ["/", onRoot],
  ["/digits", onDigits],
]);

function onRoot(req, res) {
  res.write(JSON.stringify({ status: "OK" }));
  res.end();
}

async function onDigits(req, res) {
  console.log(`open -> ${req.url}`);
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
  });

  let i = 0;

  for await (const startTime of setInterval(1000, Date.now())) {
    const now = Date.now();
    i++;
    const message = `Event #${i} time: ${new Date().toLocaleTimeString()}`;
    res.write(createSseEvent(message));
    console.log(`Produced message: "${message}"`);
    if (now - startTime > 10000) {
      res.write("event: bye\ndata: bye-bye\n\n");
      console.log(`close response ${req.url}`);
      res.end();
      break;
    }
  }
}

function accept(req, res) {
  if (routes.has(req.url)) {
    return routes.get(req.url)(req, res);
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
