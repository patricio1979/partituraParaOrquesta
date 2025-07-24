const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const os = require('os');

const clients = new Map();
let countWS = 0;

// --- Express static file server ---
const app = express();
const HTTP_PORT = 3000;

app.use(cors());

let ipNum;
let partNum = 1;

const interfaces = os.networkInterfaces();
for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      ipNum = iface.address;
      console.log(`IP local: ${iface.address}`);
    }
  }
}

// Sirve `public` para los archivos del teléfono
const publicFolder = path.join(__dirname, 'public');
app.use(express.static(publicFolder));

// Sirve `MAIN` para los archivos locales de partitura
const mainFolder = path.join(__dirname, 'MAIN');
app.use('/main', express.static(mainFolder));

// --- HTTP server ---
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Define a variable to hold the p5.js client connection
let p5jsClient = null;

wss.on('connection', (ws) => {

  //INSTRUMENT VARS
  let instrument = Math.floor(Math.random()*5)
  let pitch = Math.floor(Math.random()*11)
  let clust = Math.floor(Math.random()*2)

  const id = countWS;
  clients.set(id,ws);
  ws.id = id
  console.log(`WebSocket client connected with ID: ${id}`);

  // On message received from any client
  ws.on('message', (msg) => {

    const str = JSON.parse(msg.toString());
    // console.log(`WebSocket message received from ${id}:`, str);

    // If the client is the p5.js client, do nothing (or handle differently)
    if (ws === p5jsClient) {
      partNum = str.part;
      console.log('we are in part: ' + partNum)
      return; // Avoid sending messages back to p5.js
    }
    
    if(str == "A"){
        // console.log('A')
        instrument = Math.floor(Math.random()*5)
        clust = Math.floor(Math.random()*2)
      }
    if(str == "B"){
      pitch = Math.floor(Math.random()*11)
    }

    str.id = id
    str.instrument = instrument
    str.pitch = pitch
    str.clust = clust

    // Send message only to p5.js client if it's connected
    if (p5jsClient && p5jsClient.readyState === WebSocket.OPEN) {
      // console.log(str)
      p5jsClient.send(JSON.stringify({ type: 'interaction', value: str }));
    }

  });

  // Assign p5.js client upon connection (based on protocol)
  if (ws.protocol === 'p5js') {
    p5jsClient = ws;
    console.log('p5.js client connected');
    // if (ws.readyState === WebSocket.OPEN) {
    //   ws.send(JSON.stringify({ type: 'ip', value: ipNum }));
    // }
  }

  countWS++;
  sendClientCountToP5();

  // const interval = setInterval(() => {
  //   if (ws.readyState === WebSocket.OPEN) {
  //     ws.send(JSON.stringify({ time: Date.now() }));
  //   }
  // }, 5000);

  ws.on('close', () => {
    // clearInterval(interval);
    console.log(`WebSocket client ${id} disconnected`);
    clients.delete(id);
    // If p5.js client disconnects, clear the reference
    if (ws === p5jsClient) {
      p5jsClient = null;
      console.log('p5.js client 0 disconnected');
    }
    sendClientCountToP5();
  });
});

// --- Start server ---
server.listen(HTTP_PORT, () => {
  console.log(`Server running at http://localhost:${HTTP_PORT}`);
});

// HELPERs
function sendClientCountToP5() {
  if (p5jsClient && p5jsClient.readyState === WebSocket.OPEN) {
    const count = clients.size - 1; // -1 para no contar al propio p5jsClient
    p5jsClient.send(JSON.stringify({ type: 'clientCount', value: count }));
  }
}