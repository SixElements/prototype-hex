class NanoVector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    rotate(angle) {
        angle = NanoVector.toRadians(angle);
        let nx = (this.x * Math.cos(angle)) - (this.y * Math.sin(angle)),
            ny = (this.x * Math.sin(angle)) + (this.y * Math.cos(angle));
    
        this.x = nx;
        this.y = ny;
        return this;
    }

    translate(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }

    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    static toRadians(angle) {
        return Math.PI * angle/180;
    }
}

export default NanoVector;