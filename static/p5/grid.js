// ============================================
// P5.js Grid Captcha
// ============================================
// Click on the grid to solve the captcha
// ============================================

// === CONFIGURATION ===
const CONTAINER_ID = 'p5-grid';
const FRAME_WIDTH = 500;
const FRAME_HEIGHT = 500;
const BTN_SIZE = 50;
const MARGIN = 3;
const CELL_SIZE = 122.5;
const CELL_DIST = 3;
const ROUNDNESS = 8;

// === STATE ===
let isValid = false;
let validationStartTime = 0;

// Captcha metrics tracking
let challengeId = null;
let captchaStartTime = 0;
let moveCount = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let movementDeltas = [];

// === YOUR CUSTOM STATE ===
let solution;
let selected;
let base_img

let reload_img;

// === PRELOAD ASSETS ===
function preload() {
  base_img = loadImage('/p5/assets/base.png');
  reload_img = loadImage('/p5/assets/reload.png');
}

// === SETUP ===
function setup() {
  let canvas = createCanvas(FRAME_WIDTH + MARGIN * 2, FRAME_HEIGHT + MARGIN * 2);
  canvas.parent(CONTAINER_ID);

  // Initialize state
  isValid = false;
  validationStartTime = 0;
  captchaStartTime = millis();
  moveCount = 0;
  movementDeltas = [];

  // Initialize solution and selected
  solution = [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1];
  selected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

// === MAIN DRAW LOOP ===
function draw() {
  background(239);
  push();
  if (isValid) {
    drawSuccessState();
  } else {
    drawCaptchaChallenge();
  }
}

// === DRAW FUNCTIONS ===
function drawCaptchaChallenge() {
  drawCells();
  drawSelectedCells();
}

function drawCells() {
  image(base_img, MARGIN, MARGIN, FRAME_WIDTH, FRAME_HEIGHT);
}

function drawSelectedCells() {
  noStroke();
  fill(255, 255, 255, 50);
  for (let i = 0; i < 16; i++) {
    if (selected[i]) {
      let x = MARGIN + (i % 4) * (CELL_SIZE + CELL_DIST);
      let y = MARGIN + Math.floor(i / 4) * (CELL_SIZE + CELL_DIST);
      rect(x, y, CELL_SIZE, CELL_SIZE);
    }
  }
}
function drawSuccessState() {
  // Draw success state with fade-in
  let t = millis() - validationStartTime;
  let opacity = map(t, 0, 500, 0, 255);
  opacity = constrain(opacity, 0, 255);

  fill(50, 200, 100, opacity);
  textAlign(CENTER, CENTER);
  textSize(32);
  text('Success!', width / 2, height / 2);
}

function checkValid() {
  if (selected.join('') === solution.join('')) {
    return true;
  }
  return false;
}

function drawFrame() {
  if (!before_img) return;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.roundRect(width / 2 - FRAME_WIDTH / 2, height / 2 - FRAME_HEIGHT / 2, FRAME_WIDTH, FRAME_HEIGHT, ROUNDNESS);
  drawingContext.clip();
  image(before_img, width / 2 - FRAME_WIDTH / 2, height / 2 - FRAME_HEIGHT / 2, FRAME_WIDTH, FRAME_HEIGHT);
  drawingContext.restore();
  pop();
  return true;
}

function onValidated() {
  isValid = true;
  validationStartTime = millis();

  // Calculate captcha metrics
  const duration = millis() - captchaStartTime;

  // Calculate jitter (variance in movement)
  let jitter = 0;
  if (movementDeltas.length > 1) {
    const avgDelta = movementDeltas.reduce((a, b) => a + b, 0) / movementDeltas.length;
    const variance = movementDeltas.reduce((sum, d) => sum + Math.pow(d - avgDelta, 2), 0) / movementDeltas.length;
    jitter = Math.sqrt(variance);
  }

  const metrics = {
    challengeId: challengeId,
    duration: duration,
    moves: moveCount,
    jitter: jitter,
    accuracy: 1 // Add your accuracy calculation here
  };

  console.log('[p5 Captcha] Solved! Dispatching p5Valid event with metrics:', metrics);
  window.dispatchEvent(new CustomEvent('p5Valid', { detail: metrics }));
}

function whichCell(x, y) {
  let col = Math.floor((x - MARGIN) / (CELL_SIZE + CELL_DIST));
  let row = Math.floor((y - MARGIN) / (CELL_SIZE + CELL_DIST));
  return row * 4 + col;
}

// === INPUT HANDLERS ===
function mousePressed() {
  if (isValid) return;
  let cell = whichCell(mouseX, mouseY);
  if (cell >= 0 && cell < 16) {
    if (selected[cell] == 1) {
      selected[cell] = 0;
    } else {
      selected[cell] = 1;
    }
  }
  // Track metrics
  moveCount++;
}

function keyPressed() {
  if (key === 'Enter') {
    if (checkValid()) {
      onValidated();
    }
  }
}

// === WINDOW RESIZE ===
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// === CHALLENGE ID (called from Svelte) ===
function setCaptchaChallengeId(id) {
  console.log('[p5 Captcha] Received challengeId:', id);
  challengeId = id;
  captchaStartTime = millis();
  moveCount = 0;
  movementDeltas = [];
}

// Expose to window for Svelte access
window.setCaptchaChallengeId = setCaptchaChallengeId;
