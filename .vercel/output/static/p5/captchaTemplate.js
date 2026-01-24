// ============================================
// P5.js Captcha Template
// ============================================
// To use this template:
// 1. Copy this file and rename it (e.g., myCaptcha.js)
// 2. Customize the constants and logic below
// 3. Add your assets to /static/p5/assets/
// 4. Include in your Svelte page with a unique container ID
// ============================================

// === CONFIGURATION ===
const CONTAINER_ID = 'p5-container-new'; // Change this for each captcha
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

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
// Add your captcha-specific variables here
// let myImage;
// let targetX, targetY;

// === PRELOAD ASSETS ===
function preload() {
  // Load your images here
  // myImage = loadImage('/p5/assets/myimage.png');
}

// === SETUP ===
function setup() {
  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent(CONTAINER_ID);

  // Initialize state
  isValid = false;
  validationStartTime = 0;
  captchaStartTime = millis();
  moveCount = 0;
  movementDeltas = [];

  // Initialize your custom state here
}

// === MAIN DRAW LOOP ===
function draw() {
  background(240);

  if (isValid) {
    drawSuccessState();
  } else {
    drawCaptchaChallenge();
  }
}

// === DRAW FUNCTIONS ===
function drawCaptchaChallenge() {
  // Draw your captcha challenge here
  // Example: draw instructions
  fill(50);
  textAlign(CENTER, CENTER);
  textSize(20);
  text('Your captcha challenge here', width / 2, height / 2 - 50);

  // Example: draw interactive element
  fill(100, 150, 255);
  rect(width / 2 - 50, height / 2, 100, 40, 8);
  fill(255);
  textSize(14);
  text('Click me', width / 2, height / 2 + 20);
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

// === VALIDATION ===
function checkValid() {
  // Replace this with your validation logic
  // Return true if the captcha is solved correctly

  // Example: always return true (replace with real logic)
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

// === INPUT HANDLERS ===
function mousePressed() {
  if (isValid) return;

  // Track metrics
  moveCount++;

  // Add your click handling logic here
  // Example: check if clicked on target
  if (checkValid()) {
    onValidated();
  }
}

function mouseDragged() {
  if (isValid) return;

  // Track movement metrics
  moveCount++;
  if (lastMouseX !== 0 || lastMouseY !== 0) {
    let deltaX = mouseX - lastMouseX;
    let deltaY = mouseY - lastMouseY;
    movementDeltas.push(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
  }
  lastMouseX = mouseX;
  lastMouseY = mouseY;

  // Add your drag handling logic here
}

function mouseReleased() {
  if (isValid) return;

  // Add your release handling logic here
  // Optionally check validation on release:
  // if (checkValid()) onValidated();
}

// === WINDOW RESIZE ===
function windowResized() {
  // Optionally handle resize
  // resizeCanvas(windowWidth, windowHeight);
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
