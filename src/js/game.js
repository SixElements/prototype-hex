import GameBoard from "./GameBoard.js";
import Spell from "./Spell.js";
import {FIRE, EARTH, DECAY, AIR} from "./Elements.js";

class Game {

    constructor() {
        this.life = document.querySelector("#life");
        this.kills = document.querySelector("#kills"),
        this.wave = document.querySelector("#wave");
        this.life.value = 6;
        this.ticks = [[],[],[],[],[],[],[],[],[],[]];
        this.activeTick = 0;

        this.setupBoard();
        this.setupSpells();
        this.addInterfaceListeners();
        
        this.gameBoard.spawnWave();
        this.wave.value++;
    }

    setupBoard() {
        let svg = document.querySelector("svg")

        this.gameBoard = new GameBoard(svg);
        this.gameBoard.on("damage", (damage) => {
            !!damage ? this.life.value -= damage : this.life.value--
        });
        this.gameBoard.on("kill", () => this.kills.value++);
        /* DEBUG CLICKS */
        svg.querySelectorAll("polygon").forEach(e => {
            e.addEventListener("click", e=> {
                let phi = e.target.dataset.phi,
                    r = e.target.dataset.r;
                console.log(r, phi, this.gameBoard.fields[r][phi]);
            });
        });
    }

    setupSpells() {
        this.spells = [];
        console.log(this.gameBoard);
        this.spells[0] = new Spell("inner Star");
        this.gameBoard.fields[1].filter(e => e.positionInSextant === 1).forEach(e => this.spells[0].addElement(FIRE, 0, e));
    
    
        this.spells[1] = new Spell("middle corners");
        this.gameBoard.fields[2].filter(e => e.positionInSextant === 0 || e.positionInSextant === (e.tilesPerSextant - 1) ).forEach(e => this.spells[1].addElement(DECAY, 0, e));
        
        this.spells[2] = new Spell("outer star");
        this.gameBoard.fields[3].filter(e => e.positionInSextant === 3).forEach(e => this.spells[2].addElement(EARTH, 0, e));
    }

    addInterfaceListeners() {
        document.querySelectorAll(".trigger div").forEach((el, i) => el.addEventListener("click", () => {
            this.spells[i].cast();
            this.gameBoard.callTriggers();
            this.gameBoard.moveEnemies();
        }));    
        
        window.addEventListener("keydown", e => {
            if(e.repeat) {
                return;
            }
            //e.preventDefault();
            switch(e.which) {
                case 81:
                    this.spells[0].cast();
                    this.gameBoard.callTriggers();
                    this.gameBoard.moveEnemies();
                    break;
                case 87:
                    this.spells[1].cast();
                    this.gameBoard.callTriggers();
                    this.gameBoard.moveEnemies();
                    break;
                case 69:
                    this.spells[2].cast();
                    this.gameBoard.callTriggers();
                    this.gameBoard.moveEnemies();
                    break;
                case 32:
                    e.preventDefault();
                    this.gameBoard.callTriggers();
                    this.gameBoard.moveEnemies();
                    break;
            }
            console.log(e.which);
        });
    }

    tick() {
        this.activeTick++;
        this.ticks
        this.gameBoard.moveEnemies();
    }

}

let game = new Game();

export default Game;
