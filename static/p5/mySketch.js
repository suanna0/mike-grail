const w = 666;
const h = 383;
const btnSize = 50;
const margin = 15;
const roundness = 8;
const targetWidth = 400;
var startAngle = -180;
var endAngle = 1080;

const endX = -42.5;
const epsilon = 10;

let maxY;
let xPos;
let sliderX;
let before_img;
let glasses_img;
let solved_img;
let mike_captcha;
let reload_img;

let isValid;
let validationStartTime;

// Captcha metrics tracking
let challengeId = null;
let captchaStartTime = 0;
let moveCount = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let movementDeltas = [];

function preload() {
	mike_captcha = loadImage(
		"/p5/assets/mike_captcha.png"
	);
  before_img = loadImage(
    "/p5/assets/before_valid.png"
  );
  glasses_img = loadImage(
    "/p5/assets/glasses.png"
  );
  solved_img = loadImage(
    "/p5/assets/after_valid.png"
  );
  reload_img = loadImage(
    "/p5/assets/reload.png"
  );
}


function getCoords(x) {
	// solution is (-37.5, -57.5, 0)
	return [
		x + width/2,
	  
		(height/2 - 100 * (sin(map(x, - targetWidth/2, targetWidth/2, 0, 3)))) - 10
		- (
		  (height/2 - 100 * sin(map(endX, - targetWidth/2, targetWidth/2, 0, 3))) - 10
		  + (49 - height/2)
		),
	  
		map(x, - targetWidth/2, targetWidth/2, startAngle, endAngle)
		- map(endX, - targetWidth/2, targetWidth/2, startAngle, endAngle)
	  ];
}

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('p5-container');
	sliderX = width/2 - w/2;
	xPos = - w/2;
	isValid = false;
	validationStartTime = 0;
	captchaStartTime = millis();
	moveCount = 0;
	movementDeltas = [];
}

// Called from page to set challenge ID
function setCaptchaChallengeId(id) {
	console.log('[p5 Captcha] Received challengeId:', id);
	challengeId = id;
	captchaStartTime = millis();
	moveCount = 0;
	movementDeltas = [];
}

// Expose to window for Svelte access
window.setCaptchaChallengeId = setCaptchaChallengeId;

function draw() {
	background(239);
	image(mike_captcha, width/2 - mike_captcha.width/6, height/2 - 210 - mike_captcha.height/6, mike_captcha.width/3, mike_captcha.height/3);
	drawFrame(w, h);
	drawSlider();
	drawTarget();
	if (width <= 850) {
		drawMobile();
	}
	if (isValid) {
		drawWin();
	}
}

function drawMobile() {
	background(239);
	image(reload_img, width/2 - w/2, height/2 - h/2, w, h);
}

function drawWin() {
	// Calculate elapsed time since validation
	let t = millis() - validationStartTime;
	
	let opacity = map(t, 0, 700, 0, 255);
	opacity = constrain(opacity, 0, 255);
	
	// Apply opacity to image
	push();
	tint(255, opacity);
	image(solved_img, width/2 - w/2, height/2 - h/2, w, h);
	pop();
}

function checkValid() {
	if (endX - epsilon < xPos && xPos < endX + epsilon) {
		isValid = true;
		validationStartTime = millis();
		loadingStartTime = validationStartTime;

		// Calculate captcha metrics
		const duration = millis() - captchaStartTime;
		const accuracy = 1 - Math.abs(xPos - endX) / epsilon;

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
}

function drawSlider() {
	noStroke();
	fill(140);
	drawingContext.save();
	drawingContext.filter = 'blur(5px)';
	rect(sliderX, height/2 + h/2 + margin, btnSize, btnSize, roundness);
	drawingContext.restore();
	fill(239);
	rect(sliderX, height/2 + h/2 + margin, btnSize, btnSize, roundness);
}

function drawFrame(w, h) {
	if (!before_img) return;
	push();
	drawingContext.save();
	drawingContext.beginPath();
	drawingContext.roundRect(width/2 - w/2, height/2 - h/2, w, h, roundness);
	drawingContext.clip();
	image(before_img, width/2 - w/2, height/2 - h/2, w, h);
	drawingContext.restore();
	pop();
}

function drawTarget() {
	xPos = map(sliderX, width/2 - w/2, width/2 + w/2 - btnSize, - targetWidth/2, targetWidth/2);
	let [x, y, r] = getCoords(xPos);
	push();
	translate(x, y);
	rotate(radians(r));
	translate(-208/2, -116/2);
	image(glasses_img, 0, 0, 208, 116);
	pop();
}

function mouseDragged() {
	if (isValid) return;
	sliderX = min(max(width/2 - w/2, mouseX - btnSize/2), width/2 + w/2 - btnSize);

	// Track metrics
	moveCount++;
	if (lastMouseX !== 0 || lastMouseY !== 0) {
		let deltaX = mouseX - lastMouseX;
		let deltaY = mouseY - lastMouseY;
		movementDeltas.push(Math.sqrt(deltaX * deltaX + deltaY * deltaY));
	}
	lastMouseX = mouseX;
	lastMouseY = mouseY;
}

function mouseReleased () {
	if (isValid) return;
	checkValid();
}

function windowResized() {
	// Store the relative position of the slider (0 to 1)
	let sliderProgress = map(sliderX, width/2 - w/2, width/2 + w/2 - btnSize, 0, 1);
	
	// Resize the canvas
	resizeCanvas(windowWidth, windowHeight);
	
	// Recalculate slider position based on new window size
	sliderX = map(sliderProgress, 0, 1, width/2 - w/2, width/2 + w/2 - btnSize);
}