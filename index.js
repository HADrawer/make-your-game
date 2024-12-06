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
const startButton = document.querySelector('#start-button');

const POWER_PILL_TIME = 10000;
const GLOBAL_SPEED = 80;
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);

let score = 0;
let timer = null;
let gameTime = 0;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

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

   gameBoard.showGameStatus(gameWin);

   clearInterval(timer);

   startButton.classList.remove('hide');


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
        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
        gameBoard.rotateDiv(pacman.pos, 0);
        gameOver(pacman, gameGrid);
    }
 }
}

function gameLoop(pacman, ghosts){
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

    scoreTable.innerHTML = "Score: " + score;
    timerTable.innerHTML = "Timer: " + gameTime;

}

function startGame(){
    playAudio(soundGameStart);
    gameWin = false;
    powerPillActive = false;
    score = 0;

    startButton.classList.add('hide'); 


    gameBoard.createGrid(LEVEL);

    const pacman = new Pacman(2,287);

    gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
    document.addEventListener('keydown', (e) =>
    pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))
    );

    const ghosts = [
        new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
        new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
        new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
        new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
    ];

    timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}


startButton.addEventListener('click', startGame);