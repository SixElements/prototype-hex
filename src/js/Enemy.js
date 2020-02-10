class Enemy {

    constructor(hitpoints, type, targetFunction, hitFunction) {
        this._hitpoints = hitpoints;
        this.type = type;
        this.getTarget = targetFunction.bind(this);
        this.hit = hitFunction.bind(this);
    }

}

function collidingMove(field) {
    let moves = !!field.neighbors.hubward * 2 + 4,
    move = Math.floor(Math.random()*moves),
    target = false;

    switch(move) {
        case 0:
        case 1:
        case 2:
            target = field.neighbors.widdershins;
            break;
        case 3:
            target = field.neighbors.turnwise;
            break;
        case 4:
        case 5:
            target = field.neighbors.hubward;
            break;

    }
    return target.occupied ? false : target;
}

function simpleHitpoints(damage) {
    this._hitpoints -= damage;
    return this._hitpoints <= 0;
}

function burstInto(enemyType, damage, field) {
    if(damage <= 0) {
        return false;
    }
    for(let i in field.neighbors) {
        field.neighbors[i].enemyMoveOn(new enemyType())
    }
    return true
}

function explodeWithTimer(damage, field) {
    if(damage <= 0) {
        return false;
    }
    field.node.setAttribute("data-effect", "pulse");
    field.addTrigger(1, function() {
        this.node.setAttribute("data-effect", "");
        this.enemy = false;  
        for(let i in this.neighbors) {
            this.neighbors[i].hit(1);
        }
    });
    
}

/*
 * 1 Hitpoint
 * cannot move to occupied fields 
 */
class ENEMY_A extends Enemy {

    constructor() {
        super(1, "A", collidingMove, simpleHitpoints);
    }
}

class ENEMY_B extends Enemy {

    constructor() {
        super(2,"B", collidingMove, burstInto.bind(null,ENEMY_C));
    }
}

class ENEMY_C extends Enemy {

    constructor() {
        super(1,"C", collidingMove, simpleHitpoints);
    }
}

class ENEMY_D extends Enemy {

    constructor() {
        super(1, "D", collidingMove, explodeWithTimer)

    }
}



export {ENEMY_A, ENEMY_B, ENEMY_D};