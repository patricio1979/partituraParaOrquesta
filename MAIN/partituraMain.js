/*
Keys:
s, start 
f, fullscreen

TODO: Make everything proportional to displaySize
*/
//<-----------------------------------------CAMBIAR ESTO SIEMPRE
// SOCKET CONN VARS
// const ssid = 'OBRAtest';
// const password = '12345678';
const ssid = 'REDcosita';
const password = 'ReYDD7yQDH';
const url = 'http://192.168.101.2:3000'; 

const encryption = 'WPA'; // WPA, WEP or nopass
const qrData = `WIFI:T:${encryption};S:${ssid};P:${password};;`;

// SCORE VARS
let latestMsg = 'Waiting for message...';
let actors = {};
let socket;
let wifiQRImg, urlQRImg, qrImg, final, thanks;

let staff, noteImg, notes, comb, wW, wH;

let clustNot = ['K','L'];

//animation and perlins
let repetitionReduce = 0;
let t = 0, h = 0, e = 0, s = 0;

let version = 0;

let onlyOnes = false;

let part1 = 100,
    part2 = part1+100,
    part3 = part2+100,
    part4 = part3+100,
    part5 = part4+100;

let part1B,part2B,part3B,part4B,part5B;

let notation = null, 
    clefN = ['A','i','R','O', 'P']; //G, F, C, all, perc

let lastTime = 0;
const minInterval = 4000; // ms
let particlesHero = [];
let factor = 1;

// Create a p5.Camera object.
let cam;

// Current frame
let start = false, currFrame = 0;

let spacing = 15; // 15 default WindowDisplay is needed

let soloPartStart = 0, soloPartEnd = 0;

let audienceCount = 0;

function preload(){
  notation = loadFont('misNotaciones.otf')
}

function setup(){
  //---------------SCORE SETUP
  // pixelDensity(1)
  wW = displayWidth * pixelDensity();
  wH = displayHeight * pixelDensity();
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  staff = createGraphics(wW,wH)
  staff.background(0,0)
  buildScore()

  noteImg = createGraphics(wW, wH)
  noteImg.background(0,0)

  comb = createGraphics(wW, wH)
  comb.background(0,0)

  qrImg = createGraphics(wW, wH)
  qrImg.background(0,0)

  final = createGraphics(wW, wH)
  final.background(255,0,0)
  final.stroke(255)
  final.strokeWeight(4)
  final.textAlign(CENTER)
  final.textFont('Helvetica',90)
  final.text('FINAL', wW/2, wH/2)

  thanks = createGraphics(wW, wH)
  thanks.background(255)

  cube = createSubdividedCube(wW/2); // (radio)
  
  cam = createCamera();

  // Buttons for rehearsal
  part1B = createButton('Parte 1')
  part1B.position(150,30)
  part1B.mouseClicked(() => { currFrame = 0 });
  part2B = createButton('Parte 2')
  part2B.position(270,30)
  part2B.mouseClicked(() => { currFrame = part1 });
  part3B = createButton('Parte 3')
  part3B.position(390,30)
  part3B.mouseClicked(() => { currFrame = part2 });
  part4B = createButton('Parte 4')
  part4B.position(wW - 370,30)
  part4B.mouseClicked(() => { currFrame = part3 });
  part5B = createButton('Parte 5')
  part5B.position(wW - 250,30)
  part5B.mouseClicked(() => { currFrame = part4 });
  
  frameRate(30)
  //---------------SOCKET CONN SETUP
  // Connect to the WebSocket server
  socket = new WebSocket('ws://localhost:3000', 'p5js');

  socket.onopen = () => {
    console.log('Connected to WebSocket');
  };

  socket.onmessage = (event) => {
    const parsed = JSON.parse(event.data);

    if (typeof parsed === 'object') {
      switch (parsed.type) {
        case 'interaction':
          // Guarda los datos del cliente en actors
          actors[parsed.id] = parsed;
          // console.log(actors[parsed.id]);
          break;

        case 'clientCount':
          // Aquí haces lo que necesites con la cantidad de clientes
          console.log('Clientes conectados (sin p5js):', parsed.value);
          audienceCount = int(parsed.value);
          break;

        default:
          console.warn('Mensaje recibido con tipo desconocido:', parsed);
      }
    }
  };

  socket.onerror = (err) => {
    console.error('WebSocket error:', err);
    latestMsg = 'WebSocket error';
  };

  //---------------QR
  // Generate off-screen QR codes
  const hiddenDiv1 = createDiv().id('wifi-qr').style('display', 'none');
  const hiddenDiv2 = createDiv().id('url-qr').style('display', 'none');

  //QR for connection
  new QRCode(document.getElementById('wifi-qr'), {
    text: qrData,
    width: 200,
    height: 200
  });

  // Generate the QR code in that div
  new QRCode(document.getElementById('url-qr'), {
    text: url,
    width: 200,
    height: 200
  });

  // Wait a short moment and then grab QR images
  setTimeout(() => {
    const wifiImgEl = document.querySelector('#wifi-qr img');
    const urlImgEl = document.querySelector('#url-qr img');

    if (wifiImgEl && urlImgEl) {
      wifiQRImg = loadImage(wifiImgEl.src);
      urlQRImg = loadImage(urlImgEl.src);
    }
  }, 500); // Delay to allow QRCode generation

  // ---- Solo SETUPs
  // yPos for solist
  for(let i = 0; i < 5; i++){ // TODO: WindowDisplay
    soloStaffYs.push(displays[4][0] + spacing*i);
  }
  staffBuild(); // gather Ys for all the parts
  gests = createGraphics(wW, wH);
  gests.background(0,0);
  gests.textFont(notation, 85)
  gests.textStyle(BOLD)
}

function draw() {
  // noCursor()
if(start){
  const keys = Object.keys(actors);
  //---------------------------------------------------------------------------------------SCORE part1
  if(currFrame >= 0 && currFrame < part1){
    background(255);
    if(!onlyOnes){
      console.log('part1')
      if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({part: 1}));
      } else {
        console.warn('WebSocket not connected');
      }
      comb.clear()
      onlyOnesChange()
    }
    if(currFrame == part1-1){
      onlyOnes = false;
    }

    noteImg.clear()
    staff.clear()
    comb.background(255,50)

    if(keys.length > 0){
      for(let i in actors){
        let instrumentPass = actors[i].instrument == 4 ? 5 : actors[i].instrument
        let pitchPass = actors[i].instrument == 2 ? 8 : actors[i].pitch
        let xPos = map(actors[i].x,0,1,170,displayWidth - 50)
        let yPos = 185 + (pitchPass*7.5) + (instrumentPass * 120)
        noteImg.textFont(notation,110)
        noteImg.fill(0,0,0,map(actors[i].y,0,1,255,0))
        noteImg.text('0',xPos,yPos)
      }
    }

    buildScore()
    qrDraw()

    comb.image(noteImg,0,0);
    comb.image(staff,0,0);
    comb.image(gests,0,0);
    
    // orbitControl()
    push()
      noStroke()
      texture(comb)
      plane(wW,wH)
    pop()
  }
  // SoloPart1
  if (currFrame == 0){
    gestCurr = 1;
    print('firstWave')
    maxEvents = 6;
    let dur = (part1-0) / maxEvents;
    emitGesture(dur*frameMs);
  }
  //---------------------------------------------------------------------------------------SCORE part2
  if(currFrame >= part1 && currFrame < part2){
    background(255);
    if(!onlyOnes){
      console.log('part2')
      if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({part: 2}));
      } else {
        console.warn('WebSocket not connected');
      }
      comb.clear()
      onlyOnesChange()
      actors = {}; // renew actors' information
    }
    if(currFrame == part2-1){
      onlyOnes = false;
    }

    // Reset images
    noteImg.clear()
    staff.clear()
    comb.background(255,50)

    buildScore()

    if( currFrame >= part1 && currFrame < floor((part2-part1)*0.625)+part1 ){         // Part 2.1 modulation
      factor = map(t,0,floor((part2-part1)*0.625)-1,0,(wW * 0.65))
      t++
      repetitionReduce = factor;
      // clustersUser
      if(keys.length > 0){
        for(let i in actors){
          let instrumentPass = actors[i].instrument == 4 ? 5 : actors[i].instrument
          let yOffs = actors[i].instrument == 2 ? -9 : 0
          let yPos = 224 + (instrumentPass * 120) + yOffs
          let xPos = map(actors[i].x,0,1,170,500)
          noteImg.textFont(notation,110)
          noteImg.fill(0,0,0,map(actors[i].y,0,1,255,0))
          noteImg.text(clustNot[actors[i].clust],xPos,yPos)
        }
      }
    } else if( currFrame >= part1 && currFrame < floor((part2-part1)*0.825)+part1 ) {  // Part 2.2 normal
      //NADA
      t = 0;
      // clustersUser
      if(keys.length > 0){
        for(let i in actors){
          let instrumentPass = actors[i].instrument == 4 ? 5 : actors[i].instrument
          let yOffs = actors[i].instrument == 2 ? -9 : 0
          let yPos = 224 + (instrumentPass * 120) + yOffs
          let xPos = map(actors[i].x,0,1,170,500)
          noteImg.textFont(notation,110)
          noteImg.fill(0,0,0,map(actors[i].y,0,1,255,0))
          noteImg.text(clustNot[actors[i].clust],xPos,yPos)
        }
      }
    } else {                                                                            // Part 2.3 modulation
      factor = map(currFrame, floor((part2-part1)*0.825)+part1, part2-1,wW * 0.65,wW - 129)
      t++;
      repetitionReduce = factor;
    }

    comb.image(staff,0,0);
    comb.image(noteImg,0,0);
    comb.image(gests,0,0);

    push()
      noStroke()
      texture(comb)
      plane(wW,wH)
    pop()

    // QR plane
    push()
      noFill()
      noStroke()
      texture(qrImg)
      plane(wW,wH)
    pop()
  }
  // SoloPart2
  if (currFrame == part1){
    print('secondWave')
    gestCurr = 2;
    maxEvents = 7;
    let dur = (part2-part1) / maxEvents;
    emitGesture(dur*frameMs);
  }
  //---------------------------------------------------------------------------------------SCORE part3
  if(currFrame >= part2 && currFrame < part3){
    background(255);
    if(!onlyOnes){
      console.log('part3')
      // gests.clear()
      actors = {}; // renew actors' information
      t = 0;
      if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({part: 3}));
      } else {
        console.warn('WebSocket not connected');
      }
      comb.clear()
      onlyOnesChange()
    }
    if(currFrame == part3-1){
      t = 0;
      onlyOnes = false;
    }

    // Reset images
    noteImg.clear()
    staff.clear()
    comb.background(255,50)

    if( currFrame >= part2 && currFrame < floor((part3-part2)*0.125)+part2 ){    // Part 3.1 modulation
      let factor1a = map(t,0,floor((part3-part2)*0.125),0,-100)
      let factor1b = map(t,0,floor((part3-part2)*0.125),0,-530)
      let factor1c = map(t,0,floor((part3-part2)*0.125),0,-wH)

      let factor2 = map(t,0,floor((part3-part2)*0.125),TWO_PI, HALF_PI + PI)
      let factor3 = map(t,0,floor((part3-part2)*0.125),0,QUARTER_PI)

      // let factor4 = map(t,0,floor((part3-part2)*0.125),0,35)
      let factor5 = map(t,0,floor((part3-part2)*0.125),0,30)
      let factor6 = map(t,0,floor((part3-part2)*0.125),0,wH * 0.75)
      let factor7 = map(t,0,floor((part3-part2)*0.125),0, 50)
      let factor8 = map(t,0,floor((part3-part2)*0.125),-4000, 0)

      let factor9 = map(t,0,floor((part3-part2)*0.125),wW, wW * 1.75)
      let factor10 = map(t,0,floor((part3-part2)*0.125),wH, wH * 2)

      // ScoreHero
      push();
        noFill()
        noStroke()
        translate(factor1a, factor1b, factor1c);
        rotateZ(factor2);
        rotateY(factor3);
        texture(comb);
        plane(factor9, factor10);
      pop();
      // Mouth
      push();
        translate(0, factor5, factor8);
        noFill();
        stroke(255,0,0);
        strokeWeight(4);
        ellipse(0, -(wH/2), factor6, factor7);
      pop();

      t++;

    } else {                                                                      // Part 3.2 normalito
      // ScoreHero
      push();
        noFill()
        noStroke()
        translate(-100, -530, -wH);
        rotateZ(HALF_PI + PI);
        rotateY(QUARTER_PI);
        texture(comb);
        plane(wW * 1.75, wH * 2);
      pop();

      // Mouth
      push();
        translate(0, 30, 0);
        noFill();
        stroke(255,0,0);
        strokeWeight(4);
        ellipse(0, -(wH/2), wH * 0.75, 50);
      pop();

      // Notes
      if (millis() - lastTime >= minInterval) { // Each second, depending on actors[i].x, it will drop a note
        if (keys.length > 0) {
          for (let i in actors) {

            particlesHero.push(new Particle(noteImg.width+10, actors[i].x * (noteImg.height - 185) + 185));
          }
        }
        lastTime = millis();
      }
      // Actualizar y mostrar partículas
      for (let i = particlesHero.length - 1; i >= 0; i--) {
        particlesHero[i].update();
        particlesHero[i].show();

        if (particlesHero[i].isOffscreen()) {
          particlesHero.splice(i, 1);
        }
      }
    }

    buildScore()

    comb.image(staff,0,0);
    comb.image(noteImg,0,0);
    comb.image(gests,0,0);

    // QR plane
    push()
      noFill()
      noStroke()
      texture(qrImg)
      plane(wW,wH)
    pop()
  }
  soloPartStart = floor((part3-part2)*0.125)+part2;
  soloPartEnd = floor((part3-part2)*0.75)+part2;
  // SoloPart3
  if (currFrame == soloPartStart){
    print('thirdWave')
    gests.clear()
    gestCurr = 3;
    maxEvents = 2;
    let dur = (soloPartEnd-soloPartStart) / maxEvents;
    emitGesture(dur*frameMs);
  }
  // SoloPart3.2
  if (currFrame == floor((part3-part2)*0.75)+part2){
    print('fourthWave')
    gestCurr = 4;
    maxEvents = 2;
    let dur = (part3 - soloPartEnd) / maxEvents;
    emitGesture(dur*frameMs);
  }
  //---------------------------------------------------------------------------------------SCORE part4
  if(currFrame >= part3 && currFrame < part4){
    background(255);
    if(!onlyOnes){
      console.log('part4')
      t = 0;
      factor = 1;
      actors = {}; // renew actors' information
      if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({part: 4}));
      } else {
        console.warn('WebSocket not connected');
      }
      comb.clear()
      onlyOnesChange()

      noteImg.clear()
      staff.clear()
      buildEmpty()
    }
    if(currFrame == part4-1){
      onlyOnes = false;
      t = 0;
    }

    if( currFrame >= part3 && currFrame < floor((part4-part3)*0.125)+part3 ){      // Part 4.1 modulation

      let factorW = map(t,0,floor((part4-part3)*0.125),wW * 1.75,0)
      let factorH = map(t,0,floor((part4-part3)*0.125),wH * 2,0)
      let factorTz = map(t,0,floor((part4-part3)*0.125),(wH + 200) *-1,0)

      if(factorH !== 0){

        // Reset images
        comb.background(255,50)
        comb.image(staff,0,0);
        comb.image(noteImg,0,0);
        comb.image(gests,0,0);
        
        //ScoreHero
        push();
          noFill()
          noStroke()
          translate(-100, -530, factorTz);
          rotateZ(HALF_PI + PI);
          rotateY(QUARTER_PI);
          texture(comb);
          plane(factorW, factorH);
        pop();
        // Mouth
        let factorMw = map(t,0,floor((part4-part3)*0.125),wH * 0.75, wW*6)
        let factorMh = map(t,0,floor((part4-part3)*0.125),50, wH*6)
        push();
          translate(0, 30, 0);
          noFill();
          stroke(255,0,0);
          strokeWeight(4);
          ellipse(0, -(wH/2), factorMw, factorMh);
        pop();
      }
      // Cuby
      let factorZ = map(t,0,floor((part4-part3)*0.125)+part3 / 10000,-10000,(wW/2)*0.25)
      push()
        translate(0,0,factorZ)
        texture(staff)
        model(cube);
      pop()
      // QR plane
      push()
        noFill()
        noStroke()
        texture(qrImg)
        plane(wW,wH)
      pop()

      t++;

    } else {                                                                        // Part 4.2 normal
      // User's notes
      if(keys.length > 0){
        for(let i in actors){
          let x = map(actors[i].x,0,1,-wW/2,wW/2)
          let y = map(actors[i].y,0,1,-wH/2,wH/2)
          let loc = actors[i].clust * wW/2
          push()
            fill(0)
            noStroke()
            translate(x,y,loc)
            rotateZ(QUARTER_PI)
            ellipsoid(10,20,10)
          pop()
        }
      }
      // Cuby
      push()
        translate(0,0,(wW/2)*0.25)
        rotateY(h)
        texture(staff)
        model(cube);
      pop()
      h += 0.0025;
      movement()
    }
  }
  // SoloPart4
  if (currFrame == floor((part4-part3)*0.125)+part3){
    soloPartStart = floor((part4-part3)*0.125)+part3+1;
    soloPartEnd = floor((part5-part4)*0.85) + part4;
    print('fifthWave')
    gestCurr = 5;
    maxEvents = 1;
    let dur = (soloPartEnd-soloPartStart) / maxEvents;
    emitGesture(dur*frameMs);
  }

  
  //---------------------------------------------------------------------------------------SCORE part5
  if(currFrame >= part4 && currFrame < part5){
    background(255);
    if(!onlyOnes){
      console.log('part5')
      particlesHero = [] // Erase all particles from previous section.
      // t = 0;
      // actors = {}; // renew actors' information
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({part: 5}));
      } else {
        console.warn('WebSocket not connected');
      }
      comb.clear()
      onlyOnesChange()
    }
    if(currFrame == part5-1){
      onlyOnes = false;
      t = 0;
    }

    if( currFrame >= part4 && currFrame < floor((part5-part4)*0.85) + part4 ){      // Part 5.1 implode

      factor = map(currFrame,
        part4, floor((part5-part4)*0.85) + part4 + 1, 1, 0)

      // User's notes
      if(keys.length > 0){
        for(let i in actors){
          push()
            fill(0)
            noStroke()
            let x = map(actors[i].x,0,1,-wW/2,wW/2) * factor
            let y = map(actors[i].y,0,1,-wH/2,wH/2) * factor
            translate(x,y,0)
            rotateZ(QUARTER_PI)
            ellipsoid(10,20,10)
          pop()
        }
      }
      applyNoiseToGeometry(cube, s, t); // Apply noise each frame
      // Cuby
      push() 
        translate(0, 0, (wW/2)*0.25 )
        rotateY(h)
        texture(staff)
        model(cube);
        cam.move(0,0,e)
      pop()

      t += 0.05;
      h -= 0.0025;
      s += 0.005;
      e += 0.005;

      movement(factor)

    } else {                                                                            // Part 5.2 FIN
      console.log('FIN')
      background(255,0,0)

      push();
        noFill()
        noStroke()
        translate(0,0,0);
        texture(final);
        plane(wW,wH);
      pop();

      cam.move(0,0,e)

      // map(factorE, prevE, wantedE, 0, floor((part5-part4)*0.15))
      
      e--;
    }
  }
  //---------------------------------------------------------------------------------------SCORE goodbye
  if(currFrame >= part5){
    background(255)
    if(!onlyOnes){
      console.log('goodBye')
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({part: "goodBye"}));
      } else {
        console.warn('WebSocket not connected');
      }
      // comb.clear()
      onlyOnesChange()
    }
    // Letter
    thanks.background(255,0,0)
    thanks.stroke(0)
    thanks.fill(0)
    thanks.textAlign(CENTER)
    thanks.textFont('Helvetica',150)
    thanks.text('Árbol', wW/2, (wH/2)-100)
    thanks.textStyle(ITALIC)
    thanks.textFont('Helvetica',40)
    thanks.text('para solista y orquesta (...y audiencia)', wW/2, wH/2-50)
    thanks.textStyle(NORMAL)
    thanks.textFont('Helvetica',30)
    thanks.fill(127)
    thanks.text('Muchas gracias', wW/2, wH/2 + 220)

    image(thanks,-wW/2,-wH/2)
  }

  currFrame++;

  //---------------------------------------------------------------------------------------SCORE greetings
} else { // get current connected
  thanks.background(255)
  thanks.stroke(0)
  thanks.fill(0)
  thanks.textAlign(CENTER)
  thanks.textFont('Helvetica',150)
  thanks.text('Árbol', wW/2, (wH/2)-200)
  thanks.textStyle(ITALIC)
  thanks.textFont('Helvetica',40)
  thanks.text('para solista y orquesta', wW/2, wH/2-100)
  thanks.textStyle(NORMAL)
  thanks.textFont('Helvetica',30)
  thanks.fill(127)
  thanks.text('Tenemos: ' + audienceCount + ' usuarios conectados', wW/2, wH/2 + 220)
  // QRs
  thanks.textFont('Helvetica',40)
  thanks.textAlign(LEFT)
  if (wifiQRImg) {
    thanks.noFill()
    thanks.image(wifiQRImg, 5, 5, 130,130);
    thanks.fill(127)
    thanks.text('Internet', 140, 90);
  }
  if (urlQRImg) {
    thanks.noFill()
    thanks.image(urlQRImg, wW - 135, 5, 130,130);
    thanks.fill(127)
    thanks.text('Aplicación', wW - 330, 90);
  }

  push()
    noStroke()
    texture(thanks)
    plane(wW,wH)
  pop()
}
}
//------------------------------------------------------HELPERS
function buildScore(){ // TODO: Make proportional to the displaySize
  staffHor(200,spacing,'Maderas',5,3)
  staffHor(320,spacing,'Metales',5,3)
  staffHor(440,spacing,'Perc.s/A.',4,4)
  staffHor(560,spacing,'Perc.c/A.',5,3)
  staffHor(680,spacing,'Solista',5,0)
  staffHor(800,spacing,'Cuerdas',5,3)
}
function buildEmpty(){ // TODO: Make proportional to the displaySize
  staffNew(200,spacing,'Maderas',5,3)
  staffNew(320,spacing,'Metales',5,3)
  staffNew(440,spacing,'Percusiones sin afinación',4,4)
  staffNew(560,spacing,'Percusiones con afinación',5,3)
  staffNew(680,spacing,'Solista',5,0)
  staffNew(800,spacing,'Cuerdas',5,3)
}
function staffHor(startY,amp,insName,lines,clef){
  for(let i = 0; i < lines; i++){
    staff.stroke(0)
    staff.strokeWeight(1)
    staff.line(0,startY+(amp*i),wW,startY+(amp*i))
    staff.textFont('Helvetica')
    staff.textSize(amp*2)
    staff.textAlign(LEFT)
    staff.text(insName,10,startY-10)
    staff.textSize(amp*6)
    staff.textFont(notation)
    staff.text(clefN[clef], 10, startY+(amp*3))
    if(lines == 5 && insName !== 'Solista'){
      staff.textSize(amp*8)
      staff.text('-', 130, startY+(amp*4))
      staff.text('|', (wW - (amp*1.5))-repetitionReduce, startY+(amp*4))
    } else if (lines == 4){
      staff.textSize(amp*6)
      staff.text('-', 130, startY+(amp*3))
      staff.text('|', (wW - (amp*1.5))-repetitionReduce, startY+(amp*3))
    } else if (insName == 'Solista'){
      staff.textSize(amp*8)
      staff.text('-', 130, startY+(amp*4))
      staff.text('|', (wW - (amp*1.5)), startY+(amp*4))
    }
  }
}
function staffNew(startY,amp,insName,lines,clef){
  for(let i = 0; i < lines; i++){
    staff.stroke(0)
    staff.strokeWeight(2)
    staff.line(0,startY+(amp*i),wW,startY+(amp*i))
    staff.textSize(amp*6)
    staff.textFont(notation)
    // staff.text(clefN[clef], 10, startY+(amp*3))
  }
}
function qrDraw(){
  staff.stroke(0)
  staff.strokeWeight(2)
  staff.textFont('Helvetica',40)
  staff.textAlign(LEFT)
  if (wifiQRImg) {
    staff.noFill()
    staff.image(wifiQRImg, 5, 5, 130,130);
    qrImg.image(wifiQRImg, 5, 5, 130,130);
    staff.fill(127)
    staff.text('Internet', 140, 90);
  }
  if (urlQRImg) {
    staff.noFill()
    staff.image(urlQRImg, wW - 135, 5, 130,130);
    qrImg.image(urlQRImg, wW - 135, 5, 130,130);
    staff.fill(127)
    staff.text('Aplicación', wW - 330, 90);
  }
  staff.fill(0)
  staff.textAlign(CENTER)
  staff.textFont('Arial',100)
  staff.text('Árbol',width/2,100)
  staff.textFont('Helvetica',30)
  staff.text('...para solista y orquesta',width/2,140)
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let displays = [[200,5],[320,5],[440,4],[560,5],[680,5],[800,5]] // TODO: WindowDisplay
  noteImg.clear()
  staff.clear()
  comb.clear()
}
function onlyOnesChange(){
  onlyOnes = true;
}
function applyNoiseToGeometry(geometry, h, t) {
  let noiseScale = 0.002;     // Qué tan cerca están las ondas
  let timeScale = 0.001;      // Velocidad de evolución
  let amplitude = h;        // Qué tanto se distorsiona el cubo

  for (let i = 0; i < geometry.vertices.length; i++) {
    let base = geometry.vertices[i];

    // Posición original + tiempo → desplazamiento único y progresivo
    let n = noise(
      base.x * noiseScale,
      base.y * noiseScale,
      base.z * noiseScale + h * timeScale
    );

    // Crear desplazamiento radial coherente
    let dir = base.copy().normalize();
    let displacement = dir.mult((n - 0.5) * 2 * amplitude); // centrado

    geometry.vertices[i] = base.copy().add(displacement);
  }

  geometry.computeNormals();
  geometry.gid = `version-${version++}`;
}
function createSubdividedCube(r) {
  let g = new p5.Geometry();
  g.gid = 'subdivided-cube';

  const faces = [
    { axis: 'z', sign: 1 }, // front
    { axis: 'z', sign: -1 }, // back
    { axis: 'x', sign: 1 }, // right
    { axis: 'x', sign: -1 }, // left
    { axis: 'y', sign: 1 }, // top
    { axis: 'y', sign: -1 }  // bottom
  ];

  for (let f = 0; f < faces.length; f++) {
    let { axis, sign } = faces[f];
    let base = g.vertices.length;

    for (let j = 0; j <= 2; j++) {
      for (let i = 0; i <= 2; i++) {
        let x = -r + (r * i);
        let y = -r + (r * j);
        let v;
        if (axis === 'z') v = createVector(x, y, sign * r);
        if (axis === 'x') v = createVector(sign * r, y, -x);
        if (axis === 'y') v = createVector(x, sign * r, -y);
        g.vertices.push(v);

        // UVs
        let u = i / 2;
        let vCoord = j / 2;

        // --- desplaza las V hacia arriba sin perder continuidad -----
        const yOffset = 0.15;  // sube un 15 % del alto de la textura
        vCoord = constrain(vCoord + yOffset, 0, 1);  // evita salir de 0‑1


        g.uvs.push([u, vCoord]);
      }
    }

    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 2; i++) {
        let i0 = base + i + j * 3;
        let i1 = i0 + 1;
        let i2 = i0 + 3;
        let i3 = i2 + 1;
        g.faces.push([i0, i1, i2]);
        g.faces.push([i1, i3, i2]);
      }
    }
  }
  g.computeNormals();
  return g;
}
// KEYS
function keyPressed(){
  if(key==='f'){
  let fs = fullscreen();
    fullscreen(!fs);
  }
  if(key==='s'){
    start = true;
    // currFrame = 0;
  }
}
// CLASSES
class Particle { // ScoreHeroNotes
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(-5, 0); // Movimiento horizontal constante
    this.color = color(0);
    this.amplitude = random(5, 15); // Amplitud de oscilación
    this.noiseOffset = random(1000); // Semilla única para noise()
    this.homeY = y; // Línea de staff asignada (eje Y fijo)
  }

  update() {
    // Oscilación vertical con noise
    let noiseY = noise(this.noiseOffset) * 2 - 1; // Valor entre -1 y 1
    this.pos.y = this.homeY + noiseY * this.amplitude;
    
    // Movimiento horizontal
    this.pos.x += this.vel.x;
    
    // Cambio de color al llegar al borde
    if (this.pos.x <= 161) this.color = color(255, 0, 0);
    
    this.noiseOffset += 0.05; // Evolución del noise
  }

  show() {
    noteImg.noStroke();
    noteImg.fill(this.color);
    noteImg.text('0',this.pos.x, this.pos.y);
  }

  isOffscreen() {
    return this.pos.x < -10;
  }
}