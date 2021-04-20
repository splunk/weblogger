import WebLogger from "./WebLogger.js.js";

const myLogger = new WebLogger({
  origin: "http://localhost:8088",
  token: "6b0ba04f-1534-40ee-81eb-2bc83fe4f0da",
});

function loop() {
  const id = Math.random().toString(16).substr(2);
  myLogger.error({ id });
  console.log(`Event ${id}`);
  setTimeout(loop, 500);
}
loop();
