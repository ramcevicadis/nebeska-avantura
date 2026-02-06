// ========== PERFORMANCE HELPERS ==========

// Debounce resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    CONFIG.characterBounds.right = window.innerWidth - 50;
    CONFIG.characterBounds.bottom = window.innerHeight - 50;
  }, 250);
});

// Pause when tab not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause game
    gameActive = false;
  } else {
    // Resume if was playing
    if (lives > 0) {
      gameActive = true;
    }
  }
});

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

// ========== OPTIMIZED TOUCH CONTROLS ==========

let charX = window.innerWidth / 2;
let charY = window.innerHeight * 0.7;
let isDragging = false;
let touchStartX = 0;
let animationFrameId = null;

// Use requestAnimationFrame for smooth movement
function updateCharacterPosition() {
  character.style.transform = `translate(${charX - window.innerWidth/2}px, ${charY - window.innerHeight*0.7}px)`;
}

gameContainer.addEventListener('touchstart', (e) => {
  if (!gameActive) return;
  e.preventDefault();
  touchStartX = e.touches[0].clientX;
  isDragging = true;
});

gameContainer.addEventListener('touchmove', (e) => {
  if (!gameActive) return;
  e.preventDefault();
  
  if (isDragging) {
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - touchStartX;
    
    charX += deltaX * 0.6;
    charX = Math.max(
      CONFIG.characterBounds.left, 
      Math.min(CONFIG.characterBounds.right, charX)
    );
    
    // Update sprite
    if (deltaX < -5 && !isBoosting) {
      character.src = sprites.left;
    } else if (deltaX > 5 && !isBoosting) {
      character.src = sprites.right;
    } else if (!isBoosting) {
      character.src = sprites.normal;
    }
    
    // Use RAF for smooth rendering
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(() => {
      updateCharacterPosition();
    });
    
    touchStartX = touchX;
  }
});

gameContainer.addEventListener('touchend', (e) => {
  if (!gameActive) return;
  e.preventDefault();
  isDragging = false;
  
  if (!isBoosting) {
    character.src = sprites.idle;
  }
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
``
