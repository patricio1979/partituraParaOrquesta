//----------------------------------------GESTURE vars
let egId;

let displays = [[200,5],[320,5],[440,4],[560,5],[680,5],[800,5]] // TODO: WindowDisplay

let soloStaffYs = [], tuttiStaffYs = [];

let frameMs = 1000 / 30; // 1000 milliseconds divided by the frameRate gives the duration of each video frame.

let alters = [
  'C','T','k','C','T','k','C','T','k',
  'C','T','k','C','T','k','C','T','k',
  'C','T','k','C','T','k','C','T','k',
  'C','T','k','C','T','k','C','T','k',
  'v','w','x']

let accidentals = ['6','7','7','7','8','8','9','9','9','9','9','9','9','$','%','&','&','&','&','&','&','&','&'];

let writable = [], rhytmhMarkers = [];

let marks = false;

let rays = [];
let raysInit = 10;
const maxDist = 100;
let maskedImage;
let maskGraphics;
let cx = 0;
let cy = 0;
let gests, img;

let g1p4c = 6.28, gestLocs = [];

//GESTURE functions
function gest1part1(){ //-------------------Gesture 1 part 1
  gests.clear()
  let yOff = displays[4][0]
  // Notes
  let maxNotes = floor(random(5)+4)
  let xs = generateXPositions(maxNotes, 200, wW - 40, 30);
  // create a number of notes
  for(let i = 0; i < maxNotes; i++){ 
    let y = random(soloStaffYs) + ((floor(random(2)))*(spacing/2));
    let x = xs[i];
    gests.push()
      gests.translate(x,y)
      gests.rotate(-QUARTER_PI)
      gests.fill( floor(random(2)) * 255 )
      gests.ellipse(0,0,15,10)
    gests.pop()
    // Beam
    gests.line(x+6,y-1,x+6,yOff - spacing)
    // Accidental
    gests.text(random(alters),x-21,y)
    // Articulation
    if(counter > 2 && counter < 6){
      gests.text(random(accidentals),x-10,yOff - 35)
    }
  }
  // Connection
  gests.fill(0)
  gests.quad(
    xs[0]+6,yOff - spacing,
    xs[maxNotes-1]+7,yOff - spacing,
    xs[maxNotes-1]+7,yOff-5 - spacing,
    xs[0]+6,yOff-5 - spacing
  )
}
function gest1part2(){ //-------------------Gesture 2 part 1
  gests.clear()
  let yOff = displays[4][0]
  // Notes
  let nodes = 4
  let maxNotes = floor(random(8)+nodes) // max of 4 per node?
  let xs = generateXPositions(maxNotes, 200, width - 50, 35); 
  let ds = []
  for(let i = 0; i < nodes+1; i++){
    let d = (( (xs[maxNotes-1] - xs[0]) / nodes) * i) + (xs[0]+6)
    ds.push(d)
  }
  // create a number of notes
  for(let i = 0; i < maxNotes; i++){ 
    let x = xs[i];
    let y = soloStaffYs[floor(random(2))+3] + ((floor(random(2)))*(spacing/2));
    // Beam
    let x1 = x + 6;
    let y1 = y - 1;
    let x2 = ds.sort( (a, b) => Math.abs(x1 - a) - Math.abs(x1 - b) )[0];
    let y2 = yOff - spacing;
    let xm = (x1 + x2) / 2;
    let ym = (y1 + y2) / 2 + 10; // ajustar px hacia abajo para curvatura
    gests.push()
      gests.noFill();
      gests.stroke(0,127);
      gests.beginShape();
        gests.curveVertex(x1, y1);
        gests.curveVertex(x1, y1);
        gests.curveVertex(xm, ym); // nuevo punto medio
        gests.curveVertex(x2, y2);
        gests.curveVertex(x2, y2);
      gests.endShape();
    gests.pop()
    // Neume
    gests.push()
      gests.translate(x,y)
      gests.rotate(-QUARTER_PI)
      gests.fill( floor(random(2)) * 255 )
      gests.ellipse(0,0,15,10)
    gests.pop()
    
    // Accidental
    gests.text(random(alters),x-21,y)
  }
  // Connection
  gests.fill(0)
  gests.quad(
    xs[0]+6,yOff - spacing,
    xs[maxNotes-1]+7,yOff - spacing,
    xs[maxNotes-1]+7,yOff-5 - spacing,
    xs[0]+6,yOff-5 - spacing
  )
}
function gest1part3(){ //-------------------Gesture 1 part 3
  gests.clear()
  let yOff = displays[4][0]
  writable = [200,width-30]
  let xLoc = [];
  rhytmhMarkers = [];
  let rhythmSubdiv;
  // Rhythm separations
  for(let i = 0; i < displays.length; i++){
    let yMain = displays[i][0]
    let xPoss = []
    rhythmSubdiv = floor(random(10))+3
    let markStep = (writable[1] - writable[0]) / rhythmSubdiv
    let rhSxy = []
    for(let k = 0; k < rhythmSubdiv; k++){
      if(k != 0){
        let xFirst = k*markStep + writable[0]
        xPoss.push(xFirst)
        rhSxy.push([xFirst,yMain])
      } else {
        xPoss.push(writable[0],writable[1])
        rhSxy.push([writable[0],yMain])
        rhSxy.push([writable[1],yMain])
      }
    }
    rhytmhMarkers.push(rhSxy)
    xLoc.push(xPoss)
  }
  // Notes
  let maxNotes = floor(random(rhytmhMarkers.reduce((acc, sub) => acc + sub.length, 0)*0.5)+3)
  let xPosses = []
  xLoc = shuffle2dMatrix(xLoc)
    
  // create a number of notes
  for(let i = 0; i < maxNotes; i++){
    let idx = random(xLoc.map((a, i) => a.length > 0 ? i : -1).filter(i => i !== -1));
    let ySubIdx = floor(random(tuttiStaffYs[idx].length));
    let prevY = tuttiStaffYs[idx][ySubIdx]
    let y = prevY + ((floor(random(2)))*(spacing/2));
    let xSubIdx = floor(random(xLoc[idx].length));
    let x = xLoc[idx][xSubIdx]
    
    xLoc[idx].splice(xSubIdx, 1);
    xPosses.push(x)
    
    if(y < yOff){
      gests.push()
        gests.translate(x+6,y)
        gests.rotate(-QUARTER_PI)
        gests.fill( floor(random(255)) )
        gests.ellipse(0,0,15,10)
      gests.pop()
      // Accidental
      gests.text(random(alters),x-16,y)
    } else {
      gests.push()
        gests.translate(x-6,y)
        gests.rotate(-QUARTER_PI)
        gests.fill( floor(random(255)) )
        gests.ellipse(0,0,15,10)
      gests.pop()
      // Accidental
      gests.text(random(alters),x-26,y)
    }
    // Beam
    gests.push()
      gests.drawingContext.setLineDash(makeDashPattern(rhythmSubdiv+1));
      gests.line(x,y-1,x,yOff - spacing)
    gests.pop()
  }
  // Connection
  xPosses.sort((a, b) => a - b);
  gests.fill(0)
  gests.quad(
    xPosses[0],yOff - spacing,
    xPosses[xPosses.length-1],yOff - spacing,
    xPosses[xPosses.length-1],yOff-5 - spacing,
    xPosses[0],yOff-5 - spacing
  )
  // red marks
  push()
    gests.stroke(255,0,0)
    gests.strokeWeight(2)
    for(let j = 0; j < rhytmhMarkers.length; j++){
      for(let k = 0; k < rhytmhMarkers[j].length; k++){
        let x = rhytmhMarkers[j][k][0]
        let y = rhytmhMarkers[j][k][1]
        gests.line(x,y,x,y-10)
      }
    }
    gests.stroke(0)
  pop()
  // buildScore()
}
function gest2part3(){ //-------------------Gesture 2 part 3
  rays = [];
  cx = wW/2;
  cy = wH/2;
  for (let i = 0; i < raysInit; i++) {
    let angle = random(TWO_PI);
    let len = 1; // Initial ray (the most lame...)
    let x2 = cx + cos(angle) * len;
    let y2 = cy + sin(angle) * len;
    let ray = new Ray(cx, cy, x2, y2, angle);
    ray.active = true;
    ray.id = i; // assign ID to initial ray
    ray.parentId = null;
    rays.push(ray);
  }
  for (let ray of rays) {
    if (ray.active) {
      ray.addNew(rays);
      ray.active = false;
    }
  }
  noFill();
  let visibleRays = rays.filter(r => isSegmentVisible(r.x1, r.y1, r.x2, r.y2)); // get rid of invisible points
  let pertinentRays = Array.from(Array(raysInit), () => []) // New array with all rays
  for (let i = 0; i < visibleRays.length; i++) { // Put arrays in place
    let idx = visibleRays[i].id
    pertinentRays[idx].push(visibleRays[i])
    gests.push()
      translate(0,0)
      gests.stroke(random(50)+100)
      gests.strokeWeight(0.5)
      gests.line(visibleRays[i].x1,visibleRays[i].y1,visibleRays[i].x2,visibleRays[i].y2)
    gests.pop()
  }
  let rayLength = pertinentRays.filter((ray) => ray.length > 3); // Remove all rays with less than 3 points
  rayLength = orderByRadius(rayLength) // Order them by radius
  let rayPairs = [];
  for (let i = 0; i < rayLength.length; i++) { // Add pairs of them to build geometries
    let nextIndex = (i + 1) % rayLength.length;
    let nextRay = [...rayLength[nextIndex]].reverse()
    for(let j = 0; j < nextRay.length; j++){ // The second ray will be reversed, as their linePoints
      [nextRay[j].x1, nextRay[j].y1, nextRay[j].x2, nextRay[j].y2] = [nextRay[j].x2, nextRay[j].y2, nextRay[j].x1, nextRay[j].y1];
    }
    let pair = rayLength[i].concat(nextRay);
    rayPairs.push(pair);
  }
  let copyImg = gests.get();
  gests.clear()
  let maskG = createGraphics(width, height); // Create temporal mask
  maskG.background(0,0);
  maskG.noStroke();
  maskG.fill(0,50);

  for (let i = 0; i < rayPairs.length; i++) {
    maskG.clear(); // Clear the mask
    maskG.push()
      maskG.translate(floor(random(20))-10, floor(random(20))-10) // Begin braking it (later will have a rotation)
      maskG.beginShape(); // Build geometry
        for(let j = 0; j < rayPairs[i].length; j++){
          if(j !== 0){
            maskG.vertex(rayPairs[i][j].x1, rayPairs[i][j].y1)
            maskG.vertex(rayPairs[i][j].x2, rayPairs[i][j].y2)
          }
        }
      maskG.endShape(CLOSE);
    maskG.pop()

    let maskedImg = copyImg.get(); // copy img (the masked image is modificated so we need a new one each time)
    maskedImg.mask(maskG);  // Apply mask

    gests.push() // Draw mask in image
      gests.rotate(random(0.05)-0.025) // Rotate (manipulate bounderies)
      gests.image(maskedImg, 0, 0);
    gests.pop()
  }
}
function gest1part4(){ //-------------------Gesture 1 part 4

  for(let i = 0; i < 20; i++){
    gestLocs.push([ // factor variable from partituraMain.js
      (floor(random(wW))-(wW/2))*factor, // x
      (floor(random(wH))-(wH/2))*factor, // y
      (floor(random(wW))-(wH/2))*factor, // z
      floor(random(2))
    ])
  }
  rays = []
  gests.clear()
}
//-----------------------------------------------Helpers gestures
function emitGesture(duration) {
  if(egId !== undefined){
    clearInterval(egId); // Detiene el ciclo
  }
  counter = 0;
  eg();
  egId = setInterval(() => eg(), duration);
}
function eg() {
  counter++;
  if (counter >= maxEvents) {
    clearInterval(egId); // Detiene el ciclo
  }
  switch(gestCurr){
    case 1:
      gest1part1()
    break;
    case 2:
      gest1part2()
    break;
    case 3:
      gest1part3()
    break;
    case 4:
      gest2part3()
    break;
    case 5:
      gest1part4()
    break;
      
    default:
      print('default breuh..;')
    break;
  }
}
// Generate a list of frog jumps
function randomPath(distance, steps, maxTries = width) {
  for (let attempt = 0; attempt < maxTries; attempt++) {
    let path = [];
    let sum = 0;

    while (sum < distance) {
      // Solo pasos que no excedan el límite
      let validSteps = steps.filter(step => sum + step <= distance);
      if (validSteps.length === 0) break;

      // Elegir paso aleatorio
      let step = random(validSteps);
      path.push(step);
      sum += step;
    }
    if (sum === distance) return path;
  }
  // Si después de maxTries no encuentra nada
  return null;
}
// Generate minSpace between notes
function generateXPositions(n, minX, maxX, minDist) {
  let totalLength = maxX - minX;
  let requiredSpace = (n - 1) * minDist;

  if (requiredSpace > totalLength) {
    console.warn("No hay suficiente espacio para colocar " + n + " puntos con minDist = " + minDist);
    return [];
  }

  let extraSpace = totalLength - requiredSpace;

  // Pesos aleatorios sesgados para desigualdad más visible
  let weights = Array.from({ length: n - 1 }, () => pow(random(), 3));
  let weightSum = weights.reduce((a, b) => a + b, 0);

  let gaps = weights.map(w => minDist + (w / weightSum) * extraSpace);

  shuffle(gaps, true);
  
  let startOffset = random(minX, maxX - (requiredSpace + extraSpace));

  let positions = [startOffset];
  for (let i = 0; i < gaps.length; i++) {
    positions.push(positions[i] + gaps[i]);
  }
  return positions;
}
function shuffle2dMatrix(arr){
  for (let i = 0; i < arr.length; i++) {
    arr[i] = shuffle(arr[i]); // mezcla interna
  }
  return arr
}
// Segment beam lines by its rhytmhic subdivision
function makeDashPattern(rhythmSubdiv, unit = 5, finalSpace = 20) {
  let pattern = [];

  for (let i = 0; i < rhythmSubdiv; i++) {
    pattern.push(unit); // dash
    pattern.push(unit); // gap
  }
  let lolo = pattern.pop() // bug remove last gap
  
  pattern.push(finalSpace); // final space

  return pattern;
}
// log or exponential mapping
function curvedMap(x, inMin, inMax, outMin, outMax, mode = 'linear', base = 10) {
  x = constrain(x, inMin, inMax);
  let norm = (x - inMin) / (inMax - inMin);
  let curved;

  if (mode === 'log') {
    // Logarithmic scale: Fast growth...
    curved = Math.log(norm * (base - 1) + 1) / Math.log(base);
  } else if (mode === 'exp') {
    // Exponential scale: Slow growth...
    curved = (Math.pow(base, norm) - 1) / (base - 1);
  } else {
    // Linear scale (default)
    curved = norm;
  }

  return outMin + (outMax - outMin) * curved;
}
// Gather yPosses
function staffBuild(){
  for(let i = 0; i < displays.length; i++){
    let yMain = displays[i][0]
    let yPoss = []
    for(let j = 0; j < displays[i][1]; j++){
      yPoss.push(yMain + (j*spacing))
    }
    tuttiStaffYs.push(yPoss)
  }
}
// Check if segment is within boundaries
function isSegmentVisible(x1, y1, x2, y2) {
  return (
    (x1 >= -75 && x1 <= width+75 && y1 >= -75 && y1 <= height+75) || 
    (x2 >= -75 && x2 <= width+75 && y2 >= -75 && y2 <= height+75)
  );
}
// Order rays by radius, one next to the other
function orderByRadius(data, cx, cy) {
  return data
    .map(branch => {
      const seg = branch[0];
      const dx = seg.x2 - cx;
      const dy = seg.y2 - cy;
      const angle = Math.atan2(dy, dx);
      return { branch, angle };
    })
    .sort((a, b) => a.angle - b.angle)
    .map(obj => obj.branch)
    .reverse();
}
// Particles gravitating arround the square
function movement(f = 1){ 
    push()
      camera( 0, 0, (sin(g1p4c)*wW)*f )
      rotateY(g1p4c)
      let alphy = curvedMap(  // x, inMin, inMax, outMin, outMax, mode ['linear','log','exp'], base
          abs(sin(g1p4c)), 0.2, 0.5, 0, 255, 'linear', 1
        )
      for(let i = 0; i < gestLocs.length; i++){
        // stroke(0)
        stroke(0,alphy)
        line(
          gestLocs[i][0]*f,gestLocs[i][1]*f,gestLocs[i][2]*f,
          (gestLocs[(i+1)%gestLocs.length][0])*f,
          (gestLocs[(i+1)%gestLocs.length][1])*f,
          (gestLocs[(i+1)%gestLocs.length][2])*f
             )
        push()
          if(gestLocs[i][3] == 0){
            fill(0,alphy*f)
          } else {
            fill(255,0,0,alphy*f)
          }
          noStroke()
          translate(gestLocs[i][0]*f,gestLocs[i][1]*f,gestLocs[i][2]*f)
          rotateZ(QUARTER_PI)
          ellipsoid(15,10)
        pop()
      }
    pop()
    g1p4c -= 0.001
  }
//-----------------------------------------------Classes gestures
// Rays
class Ray {
  constructor(x1, y1, x2, y2, dir = undefined, parent = undefined) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.dir = dir || undefined;
    this.parent = parent; // ← aquí guardas la línea madre (otro Ray o null)
  }
  addNew(rays) {
    const fract = random(0.2, 0.8);
    let x1 = lerp(this.x1, this.x2, fract);
    let y1 = lerp(this.y1, this.y2, fract);
    const variance = PI / 8;

    let vec = p5.Vector.random2D();
    if (this.dir !== undefined) {
      const angle = random(this.dir - variance, this.dir + variance);
      vec.setHeading(angle);
    }
    let finished = false;
    while (!finished) {
      // enlarge till intersection
      let x2 = x1 + vec.x;
      let y2 = y1 + vec.y;

      let minDist = Number.MAX_VALUE;

      for (let r of rays) {
        if (r !== this) {
          const inter = r.intersectionPoint({ x1, y1, x2, y2 });
          if (inter.len !== undefined && inter.len < minDist && inter.len > 0) {
            x2 = inter.x;
            y2 = inter.y;
            minDist = inter.len;
          }
        }
      } // for rays
      
      if (minDist <= maxDist) {
        // finished, end while()
        finished = true;
        rays.push(new Ray(x1, y1, x2, y2, undefined, this));
        rays[rays.length - 1].id = this.id; // copy parent's ID
      } else {
        // limit to maxDist and conitnue
        vec.setMag(maxDist);
        x2 = x1 + vec.x;
        y2 = y1 + vec.y;
        rays.push(new Ray(x1, y1, x2, y2, undefined, this));
        rays[rays.length - 1].id = this.id; // copy parent's ID
        x1 = x2;
        y1 = y2;
        minDist = Number.MAX_VALUE;
        const newAngle = random(
          vec.heading() - variance,
          vec.heading() + variance
        );
        vec.setHeading(newAngle).normalize();
      }
    } // while !finished

    return;
  }

  intersectionPoint(other) {
    const txd = this.x2 - this.x1;
    const tyd = this.y2 - this.y1;
    const oxd = other.x2 - other.x1;
    const oyd = other.y2 - other.y1;

    const t = oyd * txd - oxd * tyd;
    const fr1 =
      t !== 0 ? (oxd * (this.y1 - other.y1) - oyd * (this.x1 - other.x1)) / t : 0;

    const fr2 =
      t !== 0 ? (txd * (this.y1 - other.y1) - tyd * (this.x1 - other.x1)) / t : 0;

    const x = this.x1 + txd * fr1;
    const y = this.y1 + tyd * fr1;
    const f = t !== 0 && fr1 >= 0 && fr1 <= 1 && fr2 >= 0; // is between one ray and extends the other
    const len = f ? dist(other.x1, other.y1, x, y) : undefined;

    return { x, y, len };
  }
}