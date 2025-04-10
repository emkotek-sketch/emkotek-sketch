let cat;
let catImg;
let bgImg; // Background image
let isDragging = false;
let hasLaunched = false; // Track if the cat has been launched
let launchVelocity = { x: 0, y: 0 };
let gravity = 0.3;
let friction = 0.99; // Reduced friction for gradual deceleration
let slingshotAnchor = { x: 100, y: 300 };
let angle = 0; // Rotation angle
let cameraX = 0; // Camera position
let maxStretch = 400; // Maximum stretch distance
let distanceTraveled = 0; // Track distance traveled

const pixelsToYards = 0.02625; // Conversion factor from pixels to yards (assuming 1 yard = 38 pixels)

let bgX = 0; // Position of the background scrolling

function preload() {
  catImg = loadImage('cat.png'); // Replace with your cat image file
  bgImg = loadImage('background.jpg'); // Replace with your background image file
}

function setup() {
  createCanvas(800, 400);
  cat = {
    x: slingshotAnchor.x,
    y: slingshotAnchor.y,
    vx: 0,
    vy: 0,
    radius: 20,
  };
}

function draw() {
  background(135, 206, 235); // Sky color
  
  // Scroll the background based on cat's velocity
  bgX -= cat.vx * 0.1; // Adjust the factor (0.1) to control the speed of background scroll
  
  // Draw background
  drawBackground();
  
  // Smooth camera movement following the cat from behind
  cameraX += (cat.x - width / 2 - cameraX) * 0.20;
  translate(-cameraX, 0);
  
  // Draw slingshot line only if the cat hasn't been launched
  if (!hasLaunched) {
    stroke(100, 50, 0);
    strokeWeight(4);
    line(slingshotAnchor.x, slingshotAnchor.y, cat.x, cat.y);
  }
  
  // Update angle based on velocity
  if (!isDragging) {
    angle = atan2(cat.vy, cat.vx);
  }
  
  // Draw cat with rotation
  push();
  translate(cat.x, cat.y);
  rotate(angle);
  imageMode(CENTER);
  image(catImg, 0, 0, cat.radius * 3, cat.radius * 3);
  pop();
  
  if (!isDragging) {
    cat.vy += gravity; // Apply gravity to vertical velocity
    cat.vx *= friction; // Apply friction to horizontal velocity
    cat.vy *= friction; // Apply friction to vertical velocity
    cat.x += cat.vx; // Update horizontal position
    cat.y += cat.vy; // Update vertical position

    // Calculate distance traveled from the slingshot anchor
    distanceTraveled = dist(slingshotAnchor.x, slingshotAnchor.y, cat.x, cat.y);
  }
  
  if (cat.y > height - cat.radius) {
    cat.y = height - cat.radius;
    cat.vy *= -0.6; // Bounce effect when hitting the ground
  }
  
  // Display distance traveled in yards (relative to camera)
  let distanceInYards = distanceTraveled * pixelsToYards;
  fill(0);
  textSize(18);
  text(`Distance: ${nf(distanceInYards, 1, 2)} yards`, 10 + cameraX, 30); // Adjusted text position
}

// Function to draw the moving background
function drawBackground() {
  // Draw the background image
  image(bgImg, bgX, 0, width * 2, height); // Draw the background image at the correct position
  
  // Repeat the background image to make it seamless
  if (bgX <= -width) {
    bgX = 0;
  }
}

function mousePressed() {
  let d = dist(mouseX + cameraX, mouseY, cat.x, cat.y);
  if (d < cat.radius) {
    isDragging = true;
    hasLaunched = false; // Allow re-dragging if not launched
  }
}

function mouseDragged() {
  if (isDragging) {
    let dx = mouseX + cameraX - slingshotAnchor.x;
    let dy = mouseY - slingshotAnchor.y;
    let distance = dist(mouseX + cameraX, mouseY, slingshotAnchor.x, slingshotAnchor.y);
    
    if (distance > maxStretch) {
      let angle = atan2(dy, dx);
      cat.x = slingshotAnchor.x + cos(angle) * maxStretch;
      cat.y = slingshotAnchor.y + sin(angle) * maxStretch;
    } else {
      cat.x = mouseX + cameraX;
      cat.y = mouseY;
    }
  }
}

function mouseReleased() {
  if (isDragging) {
    launchVelocity.x = (slingshotAnchor.x - cat.x) * 0.2;
    launchVelocity.y = (slingshotAnchor.y - cat.y) * 0.2;
    cat.vx = launchVelocity.x;
    cat.vy = launchVelocity.y;
    isDragging = false;
    hasLaunched = true; // The cat is now detached
  }
}
