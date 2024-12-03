import { DIRECTIONS } from "./setup.js"; 

export class Ghost {
    constructor(speed = 5,  startPos, movement, name){
        this.name = name;
        this.movement = movement;
        this.startPos = startPos;
        this.Pos = startPos;
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
        
    }
}