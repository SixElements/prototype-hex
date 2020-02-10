import Tile from "./Tile.js";
import NanoEvents from "./NanoEvents.js";
import {ENEMY_A, ENEMY_B, ENEMY_D} from "./Enemy.js";
import { TripolUtils } from "./Tripol.js";

class GameBoard {
    
    constructor(svg) {
        this._svg = svg;
        this.NUM_RINGS = 6;
        this.fields = [];

        this.emitter = new NanoEvents();

        this.buildBoard();
        this.populateNeighbors();
    }

    on(event, cb) {
        return this.emitter.on(event, cb);
    }

    buildBoard() {
        for(let r=0; r<this.NUM_RINGS; r++) {
            this.fields[r] = [];
            for(let phi = 0; phi < TripolUtils.maxPhi(r) + 1; phi++) {
                this.fields[r][phi] = {};
                let triangle = new Tile(r, phi);
    
                this.fields[r][phi] = triangle;
                triangle.on("kill", ()=> this.emitter.emit("kill"));
                triangle.on("damage", (damage)=> this.emitter.emit("damage", damage));
                this._svg.appendChild(triangle.node);
            }
        }
    }

    populateNeighbors() {
        this.fields.forEach( (ring, r) => ring.forEach( (tile) => {
            tile.neighbors.widdershins = ring[TripolUtils.widdershins(tile)];
            tile.neighbors.turnwise = ring[TripolUtils.turnwise(tile)];
            if(!tile.hubward && r > 0) {
                tile.neighbors.hubward = this.fields[r - 1][TripolUtils.hubward(tile)];
            } else if(r < this.fields.length - 1) {
                tile.neighbors.rimward = this.fields[r + 1][TripolUtils.rimward(tile)];
            }
        }));
    }

    spawnWave() {
        for(let i=0; i<65; i+=3) {
            let enemyStart = i;           
            this.fields[5][enemyStart].enemy = new ENEMY_D ();
        }
    }

    callTriggers() {
        this.fields.flat().forEach(e => e.trigger());
    }

    moveEnemies() {
        this.fields.map(ring => ring.filter(tile => tile.enemy)).flat().forEach(e => e.moveEnemy());
    }

}

export default GameBoard;