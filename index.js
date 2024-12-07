 const GRID_SIZE = 20;
 const CELL_SIZE = 20;
 const DIRECTIONS = {
    ArrowLeft: {
        code: 37,
        movement: -1,
        rotation: 180
    },
    ArrowUp: {
        code: 38,
        movement: -GRID_SIZE,
        rotation: 270
    },
    ArrowRight:{
        code: 39,
        movement: 1,
        rotation: 0
    },
    ArrowDown: {
        code: 40,
        movement: GRID_SIZE,
        rotation: 90   
    }
};

 const OBJECT_TYPE = {
    BLANK: 'blank',
    WALL: 'wall',
    DOT: 'dot',
    BLINKY: 'blinky',
    PINKY: 'pinky',
    INKY: 'inky',
    CLYDE: 'clyde',
    PILL: 'pill',
    PACMAN: 'pacman',
    GHOST: 'ghost',
    SCARED: 'scared',
    GHOSTLAIR: 'lair',
};

 const CLASS_LIST = [
    OBJECT_TYPE.BLANK,
    OBJECT_TYPE.WALL,
    OBJECT_TYPE.DOT,
    OBJECT_TYPE.BLINKY,
    OBJECT_TYPE.PINKY,
    OBJECT_TYPE.INKY,
    OBJECT_TYPE.CLYDE,
    OBJECT_TYPE.PILL,
    OBJECT_TYPE.PACMAN,
    OBJECT_TYPE.GHOSTLAIR
];

 const LEVEL = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1,
    1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1,
    0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0,
    0, 0, 0, 1, 2, 1, 2, 1, 9, 9, 9, 9, 1, 2, 1, 2, 1, 0, 0, 0,
    1, 1, 1, 1, 2, 1, 2, 1, 9, 9, 9, 9, 1, 2, 1, 2, 1, 1, 1, 1, 
    1, 0, 0, 0, 2, 2, 2, 1, 9, 9, 9, 9, 1, 2, 2, 2, 0, 0, 0, 1, 
    1, 1, 1, 1, 2, 1, 2, 1, 9, 9, 9, 9, 1, 2, 1, 2, 1, 1, 1, 1, 
    0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0,
    0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0,
    1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1,
    1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1,
    1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 7, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 7, 1,
    1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];




 class GameBoard {
   constructor(DOMGrid){
    this.dotCOUNT = 0;
    this.GRID = [];
    this.DOMGrid = DOMGrid;
   }    

   showGameStatus(gameWin) {
    const div = document.createElement('div');
    div.classList.add('game-status');
    div.innerHTML = `${gameWin ? 'WIN' : 'GAME OVER!'}`;
    this.DOMGrid.appendChild(div);
   }

   createGrid(level) {
    this.dotCOUNT = 0;
    this.grid = [];
    this.DOMGrid.innerHTML = '';
    this.DOMGrid.style.cssText = `grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE}px)`;

    level.forEach((square) => {
        const div = document.createElement('div');
        div.classList.add('square', CLASS_LIST[square]);
        div.style.cssText = `width: ${CELL_SIZE}px; height: ${CELL_SIZE}px;`;
        this.DOMGrid.appendChild(div);
        this.grid.push(div);

        if(CLASS_LIST[square] === OBJECT_TYPE.DOT) this.dotCOUNT++;
    })
   }

   addObject(pos , classes){
     this.grid[pos].classList.add(...classes);
   }
    
   removeObject(pos , classes){
    this.grid[pos].classList.remove(...classes);
  }

  objectExist = (pos, object) => {
    return this.grid[pos].classList.contains(object);
  }

  rotateDiv(pos, deg) {
    this.grid[pos].style.transform = `rotate(${deg}deg)`;
  }


  moveCharacter(character){
    if (character.shouldMove()){
      const { nextMovePos , direction } = character.getNextMove(
        this.objectExist.bind(this)
      );
      const { classesToRemove , classesToAdd} = character.makeMove();
    
      if (character.rotation && nextMovePos !== character.pos){
        this.rotateDiv(nextMovePos, character.dir.rotation);
        this.rotateDiv(character.pos, 0);
      }

      this.removeObject(character.pos,classesToRemove);
      this.addObject(nextMovePos, classesToAdd);

      character.setNewPos(nextMovePos, direction);
    }

  }

  static createGameBoard(DOMGrid, level) {
    const board = new  this(DOMGrid);
    board.createGrid(level);
    return board;
  }
}





 class Ghost {
    constructor(speed = 5,  startPos, movement, name){
        this.name = name;
        this.movement = movement;
        this.startPos = startPos;
        this.pos = startPos;
        this.dir = DIRECTIONS.ArrowRight;
        this.speed = speed;
        this.timer = 0 ;
        this.isScared = false;
        this.rotation = false;
    }
    shouldMove(){
        if (this.timer === this.speed){
            this.timer = 0;
            return true;
        }
        this.timer++;
        return false;
    }

    getNextMove(objectExist){
        const { nextMovePos, direction} = this.movement(
            this.pos,
            this.dir,
            objectExist
        );
        return {nextMovePos, direction};
    }

    makeMove(){
        const classesToRemove = [OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED, this.name];
        let classesToAdd = [OBJECT_TYPE.GHOST, this.name];

        if (this.isScared) classesToAdd = [...classesToAdd, OBJECT_TYPE.SCARED];

        return { classesToRemove, classesToAdd};
    }

    setNewPos(nextMovePos, direction) {
        this.pos = nextMovePos;
        this.dir = direction;
    }
}


 class Pacman {
    constructor(speed = 1 , startPos) {
        this.pos = startPos;
        this.speed = speed;
        this.dir = null;
        this.timer = 0;
        this.powerPill = false;
        this.rotation = true;

    }
    shouldMove(){
        if (!this.dir) return false;

        if (this.timer === this.speed){
            this.timer = 0;
            return true;
        }
        this.timer++
    }

    getNextMove(objectExist) {
        let nextMovePos = this.pos + this.dir.movement;

        if (
            objectExist(nextMovePos , OBJECT_TYPE.WALL) ||
            objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR)
        ){
            nextMovePos = this.pos;
        }
        return {nextMovePos , direction: this.dir};

    }

    makeMove(){
        const classesToRemove = [OBJECT_TYPE.PACMAN];
        const classesToAdd = [OBJECT_TYPE.PACMAN];

        return { classesToRemove , classesToAdd}
    }

    setNewPos(nextMovePos){
        this.pos = nextMovePos;
    }

    handleKeyInput(e, objectExist) {
        let dir;

        if (e.keyCode >= 37 && e.keyCode <= 40) {
            dir = DIRECTIONS[e.key];
        } else {
            return;
        }
        const nextMovePos = this.pos + dir.movement;
        if(objectExist(nextMovePos, OBJECT_TYPE.WALL)||
        objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR)) return;
        this.dir = dir; 

    }
}


 function randomMovement(position, direction, objectExist){
    let dir = direction;
    let nextMovePos = position + dir.movement;

    const keys = Object.keys(DIRECTIONS);

    while(
        objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
        objectExist(nextMovePos, OBJECT_TYPE.GHOST)
    ){
        const key = keys[Math.floor(Math.random() * keys.length)];

        dir = DIRECTIONS[key];

        nextMovePos = position + dir.movement;
    }
    return {nextMovePos,direction: dir};
}


const soundDot = new Audio('./sounds/munch.wav');
const soundPill = new Audio('./sounds/pill.wav');
const soundGameStart = new Audio('./sounds/game_start.wav');
const soundGameOver = new Audio('./sounds/death.wav');
const soundGhost = new Audio('./sounds/eat_ghost.wav');



const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const timerTable = document.querySelector('#timer');
const livesTable = document.querySelector('#lives')
const startButton = document.querySelector('#start-button');
const ResetButton = document.querySelector('#reset-button');
const pauseButton = document.querySelector('#pause-button');


const POWER_PILL_TIME = 10000;
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

let score = 0;
let timer = null;
let gameTimer = 60;
let gameTimerInterval = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;
let livesCount = 3;
let isPaused = false;
let pacman = null;
let ghosts = [];

let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;
let animationFrameId = null;

const FPS = 60;

pauseButton.classList.add('hide');
ResetButton.classList.add('hide');


function playAudio(audio) {
if (audio) {
        audio.play().catch((err) => console.error("Audio playback error:", err));
    } else {
        console.error("Audio object is null or undefined.");
    }   
}




function checkCollision(pacman, ghosts) {
 const collidedGhost = ghosts.find(ghost => pacman.pos === ghost.pos);

 if(collidedGhost){
    if(pacman.powerPill){
        playAudio(soundGhost);
     gameBoard.removeObject(collidedGhost.pos, [
        OBJECT_TYPE.GHOST,
        OBJECT_TYPE.SCARED,
        collidedGhost.name
     ]);
     collidedGhost.pos = collidedGhost.startPos;
     score += 100;
    }else {
        if (livesCount === 0){
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
        gameBoard.rotateDiv(pacman.pos, 0);
        gameOver(pacman, gameGrid);
        }else {
            livesCount--;
            gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
            gameBoard.rotateDiv(pacman.pos,0);
            ghosts.forEach((ghost) => {
              gameBoard.removeObject(ghost.pos, [OBJECT_TYPE.GHOST, ghost.name]);
              ghost.pos = ghost.startPos;
              gameBoard.addObject(ghost.startPos, [OBJECT_TYPE.GHOST, ghost.name]);
            });
            
            playAudio(soundGhost);
            pacman.pos = 287
            
        }
    }
 }
}
let lastUpdateTime = 0;
const UPDATE_INTERVAL = 1000 / 60; // 60 FPS
const FRAME_TIME = 1000 / FPS;
let accumulatedTime = 0;
const GAME_SPEED = 3; // Increase this value to slow down the game (e.g., 15 for slower, 30 for even slower)

function gameLoop(currentTime) {
  if (isPaused) {
    animationFrameId = requestAnimationFrame(gameLoop);
    return;
  }

  const deltaTime = currentTime - lastFrameTime;
  lastFrameTime = currentTime;
  accumulatedTime += deltaTime;

  while (accumulatedTime >= FRAME_TIME) {
    updateGame();
    accumulatedTime -= FRAME_TIME;
  }

  // Render the game (this happens every frame)
  renderGame();

  animationFrameId = requestAnimationFrame(gameLoop);
}

function updateGame() {
  // Only update game state every GAME_SPEED frames
  if (Math.floor(lastFrameTime / (GAME_SPEED * FRAME_TIME)) > Math.floor((lastFrameTime - FRAME_TIME) / (GAME_SPEED * FRAME_TIME))) {
    gameBoard.moveCharacter(pacman);
    checkCollision(pacman, ghosts);

    ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost));
    checkCollision(pacman, ghosts);

    // Check for dot consumption
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
      playAudio(soundDot);
      gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
      gameBoard.dotCOUNT--;
      score += 10;
    }

    // Check for power pill consumption
    if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
      playAudio(soundPill);
      gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);
      pacman.powerPill = true;
      score += 50;

      clearTimeout(powerPillTimer);
      powerPillTimer = setTimeout(() => {
        pacman.powerPill = false;
        ghosts.forEach((ghost) => (ghost.isScared = false));
      }, POWER_PILL_TIME);
    }

    // Update ghost states based on power pill
    if (pacman.powerPill !== powerPillActive) {
      powerPillActive = pacman.powerPill;
      ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
    }

    // Check win condition
    if (gameBoard.dotCOUNT === 0) {
      gameWin = true;
      gameOver(pacman, ghosts);
    }
  }
}

function renderGame() {
  // Update UI elements
  scoreTable.innerHTML = `Score: ${score}`;
  livesTable.innerHTML = `Lives: ${livesCount}`;
}

function startGame() {
  ResetButton.classList.remove('hide');
  pauseButton.classList.remove('hide');

  playAudio(soundGameStart);
  gameWin = false;
  powerPillActive = false;
  score = 0;
  gameTimer = 120;
  livesCount = 3;

  startButton.classList.add('hide');

  gameBoard.createGrid(LEVEL);

  pacman = new Pacman(2, 287);
  gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
  document.addEventListener('keydown', (e) =>
    pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))
  );

  ghosts = [
    new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
    new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
    new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
    new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
  ];

  lastFrameTime = performance.now();
  accumulatedTime = 0;
  animationFrameId = requestAnimationFrame(gameLoop);

  gameTimerInterval = setInterval(() => {
    gameTimer--;
    timerTable.innerHTML = `Timer: ${gameTimer}`;

    if (gameTimer <= 0) {
      clearInterval(gameTimerInterval);
      gameOver(pacman, gameGrid);
    }
  }, 1000);
}

function gameOver(pacman, grid) {
  playAudio(soundGameOver);
  document.removeEventListener('keydown', (e) =>
    pacman.handleKeyInput(e, gameBoard.objectExist)
  );
  pauseButton.classList.add('hide');

  gameBoard.showGameStatus(gameWin);
  clearInterval(gameTimerInterval);
  cancelAnimationFrame(animationFrameId);

  isPaused = true;
}


startButton.addEventListener('click', startGame);

ResetButton.addEventListener('click', ()=> {
    cancelAnimationFrame(animationFrameId);
    clearInterval(gameTimerInterval);
    isPaused = false;
    startGame();
    timerTable.innerHTML = 'Timer: 120';
    pauseButton.classList.remove('hide');
});

pauseButton.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        pauseButton.innerHTML = "Pause Game"; // Change the button text back to "Pause"
        lastFrameTime = performance.now();
        gameTimerInterval = setInterval(()=> {
              gameTimer--;
              timerTable.innerHTML = `Timer: ${gameTimer}`;
              if (gameTimer <= 0) {
                  clearInterval(gameTimerInterval);
                  gameOver(pacman, gameGrid);
              } 
          },1000);
        animationFrameId = requestAnimationFrame(gameLoop);
       
    } else {
        isPaused = true;
        pauseButton.innerHTML = "Resume Game"; // Change the button text to "Resume"
        
        
        clearInterval(gameTimerInterval);
        cancelAnimationFrame(animationFrameId);
    }
});

