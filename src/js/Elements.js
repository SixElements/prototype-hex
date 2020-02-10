import NanoEvents from "./NanoEvents.js";

class Element {

    constructor(damage, crit, hitFunction) {
        this.damage = damage;
        this.crit = crit;
        this.emitter = new NanoEvents();
        this.hit = hitFunction.bind(this);
    }

    get isElement() {
        return true;
    }

    on(event, cb) {
        this.emitter.on(event, cb);
    }
}

export const FIRE = new Element(1, .2, function(target) {
    target.hit(this.damage);
    if(Math.random() <= this.crit) {
        for(let i in target.neighbors) {
            let neighbor = target.neighbors[i];
            neighbor.hit(this.damage);
        }
    }
});

export const EARTH = new Element(1, 0, function(target) {
    if(target._enemy) {
        target.hit(this.damage);
    }
    target.obstacle = true;
    target.addTrigger(4, function() {
        this.obstacle = false;
    });
});

export const DECAY = new Element(1, 0, function(target) {
    if(target._enemy) {
        target.hit(this.damage);
    } else {
        target.trapped = true;
    }
});

export const AIR = new Element(0, 0, function(target) {
    
    if(target._enemy) {
        if(!!target.neighbors.rimward) {
            target.neighbors.rimward.enemyMoveOn(target._enemy);
            target.neighbors.rimward.hit(this.damage);
        } else {
            target.neighbors.turnwise.enemyMoveOn(target._enemy);
            target.neighbors.turnwise.hit(this.damage);
        }
        target.enemyMoveOff()
    }

    target.hit(this.damage);
});

//export const WATER = new Element();

//export const GROWTH = new Element();