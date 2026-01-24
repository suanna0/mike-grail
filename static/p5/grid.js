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

// === CAPTCHA CHALLENGES ===
// Each challenge has: id, caption, solution, baseImage, solvedImage, submittedBy
const CAPTCHA_CHALLENGES = [
  {
    id: 'kapital_jacket',
    caption: 'Kapital Twill 1st Jacket',
    solution: [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    baseImage: '/p5/assets/kapital_jacket_base.png',
    submittedBy: 'admin'
  },
  {
    id: 'cdg_red',
    caption: 'COMME des GARCONS Homme Plus Red Panelled T-Shirt',
    solution: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    baseImage: '/p5/assets/cdg_red_base.png',
    submittedBy: 'user123'
  },
  { 
    id: 'taiga_jean',
    caption: 'Taiga Takahashi Lot. 704 Denim Trousers C. 1920\'s - Raw Indigo',
    solution: [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0],
    baseImage: '/p5/assets/taiga_jean_base.png',
    submittedBy: 'user123'
  },
];

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

// === CHALLENGE STATE ===
let currentChallenge = null;
let solution;
let selected;
let caption = '';
let submittedBy = '';
let base_img;
let before_img;
let after_img;

// === PRELOAD ASSETS ===
function preload() {
  // Select a random challenge
  currentChallenge = CAPTCHA_CHALLENGES[Math.floor(Math.random() * CAPTCHA_CHALLENGES.length)];
  base_img = loadImage(currentChallenge.baseImage);
  before_img = loadImage('p5/assets/grid_overlay.png');
  after_img = loadImage('p5/assets/grid_success.png');
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

  // Initialize from current challenge
  solution = currentChallenge.solution.slice(); // copy array
  caption = currentChallenge.caption;
  submittedBy = currentChallenge.submittedBy;
  challengeId = currentChallenge.id;
  selected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Dispatch event with challenge info for Svelte
  window.dispatchEvent(new CustomEvent('p5ChallengeLoaded', {
    detail: {
      id: challengeId,
      caption: caption,
      submittedBy: submittedBy
    }
  }));
}

// === MAIN DRAW LOOP ===
function draw() {
  background(239);
  push();
  drawCaptchaChallenge();
  if (isValid) {
    drawSuccessState();
  } 
}

// === DRAW FUNCTIONS ===
function drawCaptchaChallenge() {
  drawCells();
  drawSelectedCells();
}

function drawCells() {
  image(base_img, MARGIN, MARGIN, FRAME_WIDTH, FRAME_HEIGHT);
  image(before_img, MARGIN, MARGIN, FRAME_WIDTH, FRAME_HEIGHT);
}

function drawSelectedCells() {
  noStroke();
  fill(239, 230, 230, 50);
  for (let i = 0; i < 16; i++) {
    if (selected[i]) {
      let x = MARGIN + (i % 4) * (CELL_SIZE + CELL_DIST);
      let y = MARGIN + Math.floor(i / 4) * (CELL_SIZE + CELL_DIST);
      rect(x, y, CELL_SIZE + 1, CELL_SIZE + 1);
    }
  }
}
function drawSuccessState() {
  let t = millis() - validationStartTime;
  let opacity = map(t, 0, 700, 0, 255);
  opacity = constrain(opacity, 0, 255);

  push();
  tint(255, opacity);
  image(base_img, MARGIN, MARGIN, FRAME_WIDTH, FRAME_HEIGHT);
  image(after_img, MARGIN, MARGIN, FRAME_WIDTH, FRAME_HEIGHT);
  pop();
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
  image(base_img, width / 2 - FRAME_WIDTH / 2, height / 2 - FRAME_HEIGHT / 2, FRAME_WIDTH, FRAME_HEIGHT);
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
    caption: caption,
    submittedBy: submittedBy,
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

// Set a specific challenge by ID (called from Svelte)
function setCaptchaChallenge(id) {
  const challenge = CAPTCHA_CHALLENGES.find(c => c.id === id);
  if (!challenge) {
    console.warn('[p5 Captcha] Challenge not found:', id);
    return false;
  }

  currentChallenge = challenge;
  solution = challenge.solution.slice();
  caption = challenge.caption;
  submittedBy = challenge.submittedBy;
  challengeId = challenge.id;
  selected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  isValid = false;
  captchaStartTime = millis();
  moveCount = 0;
  movementDeltas = [];

  // Load new images
  base_img = loadImage(challenge.baseImage);
  after_img = loadImage(challenge.solvedImage);

  console.log('[p5 Captcha] Set challenge:', id);
  return true;
}

// Add a new challenge dynamically (called from Svelte)
function addCaptchaChallenge(challenge) {
  if (!challenge.id || !challenge.caption || !challenge.solution ||
      !challenge.baseImage || !challenge.solvedImage) {
    console.warn('[p5 Captcha] Invalid challenge format');
    return false;
  }
  challenge.submittedBy = challenge.submittedBy || 'anonymous';
  CAPTCHA_CHALLENGES.push(challenge);
  console.log('[p5 Captcha] Added challenge:', challenge.id);
  return true;
}

// Get current challenge info
function getCaptchaInfo() {
  return {
    id: challengeId,
    caption: caption,
    submittedBy: submittedBy
  };
}

// Get all available challenges
function getCaptchaChallenges() {
  return CAPTCHA_CHALLENGES.map(c => ({
    id: c.id,
    caption: c.caption,
    submittedBy: c.submittedBy
  }));
}

// Reset to a new random challenge
function resetCaptcha() {
  currentChallenge = CAPTCHA_CHALLENGES[Math.floor(Math.random() * CAPTCHA_CHALLENGES.length)];
  setCaptchaChallenge(currentChallenge.id);

  window.dispatchEvent(new CustomEvent('p5ChallengeLoaded', {
    detail: getCaptchaInfo()
  }));
}

// Expose to window for Svelte access
window.setCaptchaChallengeId = setCaptchaChallengeId;
window.setCaptchaChallenge = setCaptchaChallenge;
window.addCaptchaChallenge = addCaptchaChallenge;
window.getCaptchaInfo = getCaptchaInfo;
window.getCaptchaChallenges = getCaptchaChallenges;
window.resetCaptcha = resetCaptcha;
