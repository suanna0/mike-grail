// ============================================
// P5.js Glasses Captcha
// ============================================
// Slide the glasses onto Mike's face
// ============================================

// === CONFIGURATION ===
const CONTAINER_ID = 'p5-glasses';
const FRAME_WIDTH = 666;
const FRAME_HEIGHT = 383;
const BTN_SIZE = 50;
const MARGIN = 15;
const PADDING = 10;
const ROUNDNESS = 8;
const TARGET_WIDTH = 400;
const START_ANGLE = -180;
const END_ANGLE = 1080;
const END_X = -42.5;
const EPSILON = 10;

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

// === CUSTOM STATE ===
let xPos;
let sliderX;
let before_img;
let glasses_img;
let solved_img;
let reload_img;

// === PRELOAD ASSETS ===
function preload() {
  before_img = loadImage('/p5/assets/before_valid.png');
  glasses_img = loadImage('/p5/assets/glasses.png');
  solved_img = loadImage('/p5/assets/after_valid.png');
  reload_img = loadImage('/p5/assets/reload.png');
}

// === SETUP ===
const CANVAS_WIDTH = FRAME_WIDTH + PADDING * 2;
const CANVAS_HEIGHT = FRAME_HEIGHT + MARGIN + BTN_SIZE + PADDING * 2;

function setup() {
  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent(CONTAINER_ID);

  // Initialize state
  sliderX = PADDING;
  xPos = -FRAME_WIDTH / 2;
  isValid = false;
  validationStartTime = 0;
  captchaStartTime = millis();
  moveCount = 0;
  movementDeltas = [];
}

// === MAIN DRAW LOOP ===
function draw() {
  background(239);

  if (width <= 500) {
    drawMobileState();
    return;
  }

  drawCaptchaChallenge();

  if (isValid) {
    drawSuccessState();
  }
}

// === DRAW FUNCTIONS ===
function drawCaptchaChallenge() {
  drawFrame();
  drawSlider();
  drawTarget();
}

function drawMobileState() {
  background(239);
  image(reload_img, PADDING, PADDING, FRAME_WIDTH, FRAME_HEIGHT);
}

function drawSuccessState() {
  let t = millis() - validationStartTime;
  let opacity = map(t, 0, 700, 0, 255);
  opacity = constrain(opacity, 0, 255);

  push();
  tint(255, opacity);
  image(solved_img, PADDING, PADDING, FRAME_WIDTH, FRAME_HEIGHT);
  pop();
}

function drawFrame() {
  if (!before_img) return;
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.roundRect(PADDING, PADDING, FRAME_WIDTH, FRAME_HEIGHT, ROUNDNESS);
  drawingContext.clip();
  image(before_img, PADDING, PADDING, FRAME_WIDTH, FRAME_HEIGHT);
  drawingContext.restore();
  pop();
}

function drawSlider() {
  noStroke();
  fill(140);
  drawingContext.save();
  drawingContext.filter = 'blur(5px)';
  rect(sliderX, PADDING + FRAME_HEIGHT + MARGIN, BTN_SIZE, BTN_SIZE, ROUNDNESS);
  drawingContext.restore();
  fill(255);
  rect(sliderX, PADDING + FRAME_HEIGHT + MARGIN, BTN_SIZE, BTN_SIZE, ROUNDNESS);
}

function drawTarget() {
  xPos = map(sliderX, PADDING, PADDING + FRAME_WIDTH - BTN_SIZE, -TARGET_WIDTH / 2, TARGET_WIDTH / 2);
  let [x, y, r] = getCoords(xPos);
  push();
  translate(x, y);
  rotate(radians(r));
  translate(-208 / 2, -116 / 2);
  image(glasses_img, 0, 0, 208, 116);
  pop();
}

// === HELPER FUNCTIONS ===
function getCoords(x) {
  // Solution is at END_X
  const centerY = FRAME_HEIGHT / 2;
  return [
    x + PADDING + FRAME_WIDTH / 2,
    PADDING + (centerY - 100 * sin(map(x, -TARGET_WIDTH / 2, TARGET_WIDTH / 2, 0, 3))) -
      10 -
      (centerY - 100 * sin(map(END_X, -TARGET_WIDTH / 2, TARGET_WIDTH / 2, 0, 3)) - 10 + (49 - centerY)),
    map(x, -TARGET_WIDTH / 2, TARGET_WIDTH / 2, START_ANGLE, END_ANGLE) -
      map(END_X, -TARGET_WIDTH / 2, TARGET_WIDTH / 2, START_ANGLE, END_ANGLE)
  ];
}

// === VALIDATION ===
function checkValid() {
  return END_X - EPSILON < xPos && xPos < END_X + EPSILON;
}

function onValidated() {
  isValid = true;
  validationStartTime = millis();

  // Calculate captcha metrics
  const duration = millis() - captchaStartTime;
  const accuracy = 1 - Math.abs(xPos - END_X) / EPSILON;

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
    accuracy: accuracy
  };

  console.log('[p5 Captcha] Solved! Dispatching p5Valid event with metrics:', metrics);
  window.dispatchEvent(new CustomEvent('p5Valid', { detail: metrics }));
}

// === INPUT HANDLERS ===
function mouseDragged() {
  if (isValid) return;
  sliderX = min(max(PADDING, mouseX - BTN_SIZE / 2), PADDING + FRAME_WIDTH - BTN_SIZE);

  // Track movement metrics
  moveCount++;
  if (lastMouseX !== 0 || lastMouseY !== 0) {
    let deltaX = mouseX - lastMouseX;
    let deltaY = mouseY - lastMouseY;
    movementDeltas.push(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
  }
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseReleased() {
  if (isValid) return;
  if (checkValid()) {
    onValidated();
  }
}

// === CHALLENGE ID (called from Svelte) ===
function setCaptchaChallengeId(id) {
  console.log('[p5 Captcha] Received challengeId:', id);
  challengeId = id;
  captchaStartTime = millis();
  moveCount = 0;
  movementDeltas = [];
}

// Reset captcha to initial state (called from Svelte on failure)
function resetCaptcha() {
  console.log('[p5 Captcha] Resetting captcha...');
  sliderX = PADDING;
  xPos = -FRAME_WIDTH / 2;
  isValid = false;
  validationStartTime = 0;
  captchaStartTime = millis();
  moveCount = 0;
  movementDeltas = [];
  lastMouseX = 0;
  lastMouseY = 0;
}

// Expose to window for Svelte access
window.setCaptchaChallengeId = setCaptchaChallengeId;
window.resetCaptcha = resetCaptcha;
