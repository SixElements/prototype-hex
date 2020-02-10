import NanoVector from "./NanoVector.js";
import {GRID_X0, GRID_Y0, TILE_SIDE, TILE_HEIGHT} from "./Constants.js";
import NanoEvents from "./NanoEvents.js";
import { TripolWithPoints } from "./Tripol.js";

class Tile extends TripolWithPoints{

    constructor(r, phi) {
        super(r, phi);

        this.node = this.createSVG();
        this.node.setAttribute("data-phi", phi);
        this.node.setAttribute("data-r", r);

        this.neighbors = {};
        this.occupied = false;
        this.triggers = [];

        this.emitter = new NanoEvents();
    }

    on(event, cb) {
        this.emitter.on(event, cb);
    }

    set occupied(bool) {
        this._occupied = bool;
        this.node.setAttribute("data-occupied", bool);
    }

    set enemy(enemy) {
        this._enemy = enemy;
        this.node.setAttribute("data-enemy", enemy.type);
    }

    get enemy() {
        return this._enemy;
    }

    set trapped(bool) {
        this._trapped = bool;
        this.node.setAttribute("data-trapped", bool);
    }

    set obstacle(bool) {
        this._obstacle = bool;
        this.node.setAttribute("data-obstacle", bool);
    }

    get occupied() {
        return !!this.enemy || this._obstacle;
    }

    addTrigger(delay, cb) {
        this.triggers[delay] = this.triggers[delay] || [];
        this.triggers[delay].push(cb.bind(this));
    }

    trigger() {
        for(let i = 1; i < this.triggers.length; i++) {
            this.triggers[i-1] = this.triggers[i];
            this.triggers[i] = [];
        }
        if(this.triggers[0] !== undefined) {
            this.triggers[0].forEach(cb => cb());
        }  
    }

    moveEnemy() {
        if(this.r === 0) {
            return;
        }
        let target = this.enemy.getTarget(this);
        if(!target) {
            return;
        }
        target.enemyMoveOn(this.enemy);
        this.enemy = false;
    }

    enemyMoveOn(enemy) {
        this.enemy = enemy;
        if(this._trapped) {
            this.trapped = false;
            this.hit(1);
        } 
        if(this.r === 0) {
            this.enemy = false; 
            this.hit(1);
        }
    }

    enemyMoveOff() {
        this.enemy = false;
    }

    hit(damage) {
        if(this.enemy) {
            let kill = this.enemy.hit(damage, this);
            if(kill) {
                this.enemy = false;
                this.emitter.emit("kill");
            }
        }
        if(this.r === 0) {
            this.emitter.emit("damage", damage);
        }
        this.node.setAttribute("data-hit", true);
        setTimeout(() => {
            this.node.setAttribute("data-hit", false);
        },300);
    }

    createSVG() {
        let svgPoints =  [...this.points],
            node = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        
        svgPoints.forEach(p => {
            p.multiplyScalar(TILE_SIDE).translate(GRID_X0,GRID_Y0);
        });

        let a = svgPoints[0],
            b = svgPoints[1],
            c = svgPoints[2];
        node.setAttribute("points", 
            `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`);
        return node;
    }
}

export default Tile;