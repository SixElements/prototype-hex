import NanoEvents from "./NanoEvents.js";

class Spell {

    constructor(name) {
        this.name = name;
        this._castStack = [[],[],[]];
        this.emitter = new NanoEvents();
    }

    on(event, cb) {
        this.emitter.on(event, cb);
    }
    
    addElement(element, timeSlot, tile) {
        if(element.isElement && !!tile && 0 <= timeSlot <= 2) {
            this._castStack[timeSlot].push({
                target: tile,
                element: element,
            });
        }
        element.on("kill", () => this.emitter.emit("kill"));    
    }

    removeElement(timeSlot, tile) {
        this._castStack[timeSlot] = this._castStack[timeSlot].filter(e => e.tile !== tile);
    }

    cast() {
        clearTimeout(this._timeOut1);
        clearTimeout(this._timeOut2);
        this.castTimeSlot(0);
        this._timeOut1 = setTimeout(this.castTimeSlot.bind(this,1), 500);
        this._timeOut2 = setTimeout(this.castTimeSlot.bind(this,2), 1000);
    }

    castTimeSlot(i) {
        this._castStack[i].forEach(e => {
            e.element.hit(e.target);
        });
    }
}

export default Spell;