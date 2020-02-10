import NanoVector from "./NanoVector.js";
/**
 * 
 * 
 */
export class Tripol {
    /**
     * Create a new point in polar-triangular coordinates.
     * 
     * @param {number} r - Radius on which this 
     * @param {number} phi - position along
     */
    constructor(r, phi) {
        this._r = r;
        this._phi = phi;
        this._recalculate();
    }

    set r(r) {
        this._r = r;
        this._recalculate()
    }

    get r() {
        return this._r;
    }

    set phi(phi) {
        this._phi = phi;
        this._recalculate();
    }

    get phi() {
        return this._phi;
    }

    _recalculate() {
        let tilesPerSextant = TripolUtils.tilesPerSextant(this.r);

        this.sextant = Math.floor(this.phi/tilesPerSextant);
        this.rotation = this.sextant * 60;
        this.positionInSextant = this.phi % tilesPerSextant;
        this.signedPosition = this.positionInSextant - this.r;
        this.hubward = this.positionInSextant % 2 === 0;
    }
}

export class TripolUtils {

    static tilesPerSextant(r) {
        return 2 * r + 1;
    }

    static maxPhi(r) {
        return TripolUtils.tilesPerSextant(r) * 6 - 1;
    }

    static widdershins(tri) {
        let phiMax = TripolUtils.maxPhi(tri.r);
        return tri.phi !== 0 ? tri.phi - 1 : phiMax;
    }

    static turnwise(tri) {
        let phiMax = TripolUtils.maxPhi(tri.r);
        return tri.phi < phiMax ? tri.phi+1 : 0;
    }

    static hubward(tri) {
        return tri.phi - 2 * tri.sextant - 1
    }

    static rimward(tri) {
        return tri.phi + 2 * tri.sextant + 1
    }
}

export class TripolWithPoints extends Tripol {

    constructor(r, phi) {
        super(r, phi);
    }

    _recalculate() {
        super._recalculate();
        this.hubward ? this._even() : this._odd();
    }

    _odd() {
        let a = new NanoVector(
                (this.signedPosition - 1)/2, 
                this.r * -Math.sin(Math.PI/3)
            ).rotate(this.rotation),
            b = new NanoVector(
                (this.signedPosition + 1)/2, 
                this.r * -Math.sin(Math.PI/3)
            ).rotate(this.rotation),
            c = new NanoVector(
                this.signedPosition/2, 
                (this.r + 1) * -Math.sin(Math.PI/3)
            ).rotate(this.rotation);
        this.points = [a, b, c];
    }

    _even() {
        let a = new NanoVector(
                this.signedPosition/2, 
                this.r * -Math.sin(Math.PI/3)
            ).rotate(this.rotation),
            b = new NanoVector(
                (this.signedPosition + 1)/2,
                (this.r + 1) * -Math.sin(Math.PI/3)
            ).rotate(this.rotation),
            c = new NanoVector(
                (this.signedPosition - 1)/2, 
                (this.r + 1) * -Math.sin(Math.PI/3)
            ).rotate(this.rotation);
        this.points = [a, b, c];
    }
}
