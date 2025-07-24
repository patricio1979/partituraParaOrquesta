let gui;

// Create a variable for your Slider2d
let tdS, noteBut, dynBut;

let socket;

window.addEventListener('load', () => {
  const host = window.location.hostname;
  socket = new WebSocket('ws://' + host + ':3000'); // adjust port if needed

  socket.onopen = () => {
    console.log('Client connected!');
  };

  socket.onmessage = (event) => {
    // console.log('Message from server:', event.data);
  };

  socket.onerror = (err) => {
    console.error('WebSocket error:', err);
  };
});

function setup() {
  createCanvas(windowWidth, windowHeight);
  gui = createGui();
  
  // Create Slider2d.
  // The last four optional arguments define minimum and maximum values 
  // for the x and y axes; minX, maxX, minY, maxY
  // The default min and max values for all four are -1 and 1.
  tdS = createSlider2d('colo',
    10, 10, width - 20, height/2,
    0, 1, 1, 0
  );
  tdS.setStyle({
    fillBg: color('white'),
    handleRadius: 20
  });
  tdS.onChange = function() {
    // print(tdS.val);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(tdS.val));
      // console.log('Sent:', tdS.val);
    } else {
      console.warn('WebSocket not connected');
    } 
  }
  
  noteBut = createButton('A',
    10,(height/2) + 30,
    (width/2)-20, 100)
  noteBut.setStyle({
    fillBg: color('white')
  })
  noteBut.onPress = function() {
    // print(noteBut.label + " pressed.");
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify('A'));
      // console.log('Sent:', 'A');
    } else {
      console.warn('WebSocket not connected');
    }
  }
  
  dynBut = createButton('B',
    (width/2) + 10,(height/2) + 30,
    (width/2) - 20, 100)
  dynBut.setStyle({
    fillBg: color('white')
  })
  dynBut.onPress = function() {
    // print(dynBut.label + " pressed.");
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify('B'));
      // console.log('Sent:', 'B');
    } else {
      console.warn('WebSocket not connected');
    }
  }
}

function draw() {
  background(200);
  drawGui();
}

/// Add these lines below sketch to prevent scrolling on mobile
function touchMoved() {
  // do some stuff
  return false;
}

// Resize the canvas when the
// browser's size changes.
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}