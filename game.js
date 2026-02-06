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
``
