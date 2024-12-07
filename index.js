import { LEVEL, OBJECT_TYPE} from "./setup.js";
import { randomMovement } from "./ghostMoves.js";


import { GameBoard } from './GameBoard.js';
import { Pacman } from "./Pacman.js";
import { Ghost }  from "./Ghost.js";


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
const GAME_SPEED = 5;
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


function gameOver(pacman, grid){
    playAudio(soundGameOver);
   document.removeEventListener('ketdown', e =>
     pacman.handleKeyInput(e, gameBoard.objectExist)
   );
   pauseButton.classList.add('hide');

   gameBoard.showGameStatus(gameWin);
   clearInterval(gameTimerInterval);
//    clearInterval(timer);
   cancelAnimationFrame(animationFrameId);

   


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
            playAudio(soundGhost);
            pacman.pos = 287
            
        }
    }
 }
}
// function gameLoop(pacman, ghosts)
function gameLoop(currentTime){ 
    if(!isPaused){
        animationFrameId = requestAnimationFrame(gameLoop);

        const deltaTime = currentTime - lastFrameTime;
        
        if (deltaTime >= frameInterval) {
            lastFrameTime = currentTime - (deltaTime % frameInterval);
            if (Math.floor(lastFrameTime/ (GAME_SPEED * frameInterval)) > Math.floor((lastFrameTime - deltaTime)/ (GAME_SPEED *frameInterval))){

            
                gameBoard.moveCharacter(pacman);
                checkCollision(pacman, ghosts);

                ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost));
                checkCollision(pacman, ghosts); 

                if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
                    playAudio(soundDot);
                    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
                    gameBoard.dotCOUNT--;
                    score += 10;
                }
                if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)){
                    playAudio(soundPill);
                    gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);
                    
                    pacman.powerPill = true;
                    score += 50;

                    clearTimeout(powerPillTimer);
                    powerPillTimer = setTimeout(
                        () => (pacman.powerPill = false),
                        POWER_PILL_TIME
                    );
                }

                    if(pacman.powerPill !== powerPillActive) {
                        powerPillActive = pacman.powerPill;
                        ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
                    }

                    if (gameBoard.dotCOUNT === 0) {
                        gameWin = true;
                        gameOver(pacman, ghosts);
                    }
                    // if (gameTimer === 0) {
                    //     gameOver(pacman, gameGrid);
                    // }

            scoreTable.innerHTML = "Score: " + score;
            timerTable.innerHTML = `Timer: ${gameTimer}`;
            livesTable.innerHTML = `Lives: ${livesCount}`;
            }

            // const fps = Math.round(1000 / deltaTime);
            // document.getElementById('fps').innerHTML = `FPS: ${fps}`;
        }
    }           
}

function startGame(){
    ResetButton.classList.remove('hide');
    pauseButton.classList.remove('hide');


    playAudio(soundGameStart);
    gameWin = false;
    powerPillActive = false;
    score = 0;
    gameTimer = 120 ;
    livesCount = 3;

    startButton.classList.add('hide'); 


    gameBoard.createGrid(LEVEL);

     pacman = new Pacman(2,287);

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
    livesTable.innerHTML = `Lives: ${livesCount}`;

    // timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);

    lastFrameTime = performance.now();
    animationFrameId = requestAnimationFrame(gameLoop);

    gameTimerInterval = setInterval(() => {
        gameTimer--;
        timerTable.innerHTML = `Timer: ${gameTimer}`;
        if (gameTimer == 0 ) {
        clearInterval(gameTimerInterval);
        gameOver(pacman, gameGrid);
    }
    }, 1000)
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
        animationFrameId = requestAnimationFrame(gameLoop);
        // timer = setInterval(()=> gameLoop(pacman, ghosts), GLOBAL_SPEED);
        // gameTimerInterval = setInterval(()=> {
        //     gameTimer--;
        //     timerTable.innerHTML = `Timer: ${gameTimer}`;
        //     if (gameTimer <= 0) {
        //         clearInterval(gameTimerInterval);
        //         gameOver(pacman, gameGrid);
        //     } 
        // },1000);
    } else {
        // If the game is currently running, pause the game
        isPaused = true;
        pauseButton.innerHTML = "Resume Game"; // Change the button text to "Resume"
        
        // Clear the timers to stop the game
        // clearInterval(timer);
        clearInterval(gameTimerInterval);
        cancelAnimationFrame(animationFrameId);
    }
});

