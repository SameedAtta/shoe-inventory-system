const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const app = require("../server");
const PORT = process.env.PORT || 3006;

const server = http.createServer(app);

server.listen(PORT);

function onListenPort() {
  console.log("✅ Server is running at http://localhost:" + PORT);
}

function onError(error) {
  console.error("❌ Server Error", error);
}

server.on("error", onError);
server.on("listening", onListenPort);


// const http = require('http');
// const dotenv = require('dotenv');
// dotenv.config();
// const app = require('../server');
// const PORT = process.env.PORT;
// const server = http.createServer(app);
// server.listen(PORT);

// function onListenPort() {
//     console.log("Server is running at "+ PORT )
// }
// function onError(error)
// {
//     console.log("Server Error", error);
// }

// server.on('error', onError);
// server.on('listening', onListenPort);