export class Vec2 {
    x: number
    y: number

    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }


    sub(v: Vec2) {
        let x = this.x - v.x
        let y = this.y - v.y

        return new Vec2(x, y)
    }

    add(v: Vec2) {
        let x = this.x + v.x
        let y = this.y + v.y

        return new Vec2(x, y)
    }

    divideScalar(scalar: number) {
        let x = this.x / scalar
        let y = this.y / scalar

        return new Vec2(x, y)
    }

    multiplyScalar(scalar: number) {
        let x = this.x * scalar
        let y = this.y * scalar

        return new Vec2(x, y)
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }

    normalize() {
        let length = this.length()
        let x = this.x / length
        let y = this.y / length

        return new Vec2(x, y)
    }

    dot(v: Vec2) {
        let x = this.x * v.x
        let y = this.y * v.y

        return x + y
    }

    cross(v: Vec2) {

    }
}
