const sprites = {
  idle: 'assets/sprites/character/boy-flying-idle.png',
  normal: 'assets/sprites/character/boy-flying-normal.png',
  boost: 'assets/sprites/character/boy-flying-boost.png',
  left: 'assets/sprites/character/boy-flying-left.png',
  right: 'assets/sprites/character/boy-flying-right.png'
};

const gameContainer = document.getElementById('game-container');
const character = document.getElementById('character');
const scoreDisplay = document.querySelector('#score span');
const livesDisplay = document.getElementById('lives');
const boostBtn = document.getElementById('boost-btn');

let charX = window.innerWidth / 2;
let charY = window.innerHeight * 0.7;
let score = 0;
let lives = 3;
let isBoosting = false;
let touchStartX = 0;
let isDragging = false;

function init() {
  character.style.left = charX + 'px';
  character.style.top = charY + 'px';
  scoreDisplay.textContent = '0';
  livesDisplay.textContent = '❤️❤️❤️';
}

gameContainer.addEventListener('touchstart', (e) => {
  e.preventDefault();
  touchStartX = e.touches[0].clientX;
  isDragging = true;
});

gameContainer.addEventListener('touchmove', (e) => {
  e.preventDefault();
  
  if (isDragging) {
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - touchStartX;
    
    charX += deltaX * 0.6;
    charX = Math.max(50, Math.min(window.innerWidth - 50, charX));
    
    if (deltaX < -5 && !isBoosting) {
      character.src = sprites.left;
    } else if (deltaX > 5 && !isBoosting) {
      character.src = sprites.right;
    } else if (!isBoosting) {
      character.src = sprites.normal;
    }
    
    character.style.left = charX + 'px';
    touchStartX = touchX;
  }
});

gameContainer.addEventListener('touchend', (e) => {
  e.preventDefault();
  isDragging = false;
  
  if (!isBoosting) {
    character.src = sprites.idle;
  }
});

function triggerBoost() {
  if (isBoosting) return;
  
  isBoosting = true;
  character.src = sprites.boost;
  character.style.transform = 'translate(-50%, -50%) scale(1.15)';
  boostBtn.style.opacity = '0.5';
  
  setTimeout(() => {
    isBoosting = false;
    character.src = sprites.idle;
    character.style.transform = 'translate(-50%, -50%) scale(1)';
    boostBtn.style.opacity = '1';
  }, 1000);
}

boostBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  e.stopPropagation();
  triggerBoost();
});

init();

// ========== COLLECTIBLES SYSTEM ==========

// Collectible config
const COLLECTIBLES = {
  spawnInterval: 2000,  // Nova zvezda na svakih 2 sekunde
  fallSpeed: 3,
  points: 10,
  size: 40
};

// Spawn collectible (star)
function spawnCollectible() {
  const star = document.createElement('div');
  star.className = 'collectible star';
  star.textContent = '⭐';
  star.style.fontSize = COLLECTIBLES.size + 'px';
  star.style.position = 'absolute';
  star.style.left = (Math.random() * (window.innerWidth - 60) + 30) + 'px';
  star.style.top = '-60px';
  star.style.zIndex = '60';
  star.style.pointerEvents = 'none';
  
  document.getElementById('game-elements').appendChild(star);
  
  // Animate downward
  let starY = -60;
  const moveInterval = setInterval(() => {
    starY += COLLECTIBLES.fallSpeed;
    star.style.top = starY + 'px';
    
    // Check collision with character
    if (checkCollision(character, star)) {
      collectStar(star, moveInterval);
    }
    
    // Remove if off screen
    if (starY > window.innerHeight + 60) {
      star.remove();
      clearInterval(moveInterval);
    }
  }, 30);
}

// Collect star
function collectStar(star, interval) {
  score += COLLECTIBLES.points;
  scoreDisplay.textContent = score;
  
  // Visual feedback
  star.style.transition = 'transform 0.3s, opacity 0.3s';
  star.style.transform = 'scale(1.5)';
  star.style.opacity = '0';
  
  clearInterval(interval);
  setTimeout(() => star.remove(), 300);
}

// Collision detection
function checkCollision(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

// Start spawning collectibles
setInterval(spawnCollectible, COLLECTIBLES.spawnInterval);
``
// ========== OBSTACLES SYSTEM ==========

// Obstacle config
const OBSTACLES = {
  spawnInterval: 3500,  // Nova prepreka na svakih 3.5 sekundi
  fallSpeed: 4,
  damage: 1,  // Oduzima 1 život
  size: 50
};

// Spawn obstacle
function spawnObstacle() {
  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.textContent = '☁️'; // Ili '💀' ili '⚡'
  obstacle.style.fontSize = OBSTACLES.size + 'px';
  obstacle.style.position = 'absolute';
  obstacle.style.left = (Math.random() * (window.innerWidth - 80) + 40) + 'px';
  obstacle.style.top = '-80px';
  obstacle.style.zIndex = '60';
  obstacle.style.pointerEvents = 'none';
  obstacle.style.filter = 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))';
  
  document.getElementById('game-elements').appendChild(obstacle);
  
  // Animate downward
  let obstacleY = -80;
  const moveInterval = setInterval(() => {
    obstacleY += OBSTACLES.fallSpeed;
    obstacle.style.top = obstacleY + 'px';
    
    // Check collision
    if (checkCollision(character, obstacle)) {
      hitObstacle(obstacle, moveInterval);
    }
    
    // Remove if off screen
    if (obstacleY > window.innerHeight + 80) {
      obstacle.remove();
      clearInterval(moveInterval);
    }
  }, 30);
}

// Hit obstacle
function hitObstacle(obstacle, interval) {
  lives -= OBSTACLES.damage;
  updateLives();
  
  // Visual feedback - blink character
  character.style.opacity = '0.3';
  setTimeout(() => { character.style.opacity = '1'; }, 100);
  setTimeout(() => { character.style.opacity = '0.3'; }, 200);
  setTimeout(() => { character.style.opacity = '1'; }, 300);
  
  obstacle.remove();
  clearInterval(interval);
  
  // Check game over
  if (lives <= 0) {
    gameOver();
  }
}

// Update lives display
function updateLives() {
  livesDisplay.textContent = '❤️'.repeat(Math.max(0, lives));
  
  // Animate lives
  livesDisplay.style.transform = 'scale(1.3)';
  setTimeout(() => {
    livesDisplay.style.transform = 'scale(1)';
  }, 200);
}

// Start spawning obstacles
setInterval(spawnObstacle, OBSTACLES.spawnInterval);
