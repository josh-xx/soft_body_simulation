import {Vec2} from "./vector";

const log = console.log.bind(console)

class Point {
    position: Vec2
    velocity: Vec2
    acceleration: Vec2
    force: Vec2
    mass: number = 1

    x: number
    y: number
    // 速度
    vx: number = 0
    vy: number = 0
    // 力
    fx: number = 0
    fy: number = 0

    constructor(x, y, mass = 1) {
        this.position = new Vec2(x, y)
        this.velocity = new Vec2()
        this.acceleration = new Vec2()
        this.force = new Vec2()
        this.mass = mass

        this.x = x
        this.y = y
    }
}

class Spring {
    p1: Point
    p2: Point

    restLength: number

    ks: number = 2000 // stiffness
    kd: number = 12 // damping term

    max: number = 1.2
    min: number = 0.3

    constructor(p1: Point, p2: Point, restLength: number) {
        this.p1 = p1
        this.p2 = p2
        this.restLength = restLength
    }

    update() {
        this.p1.acceleration = new Vec2()
        this.p2.acceleration = new Vec2()

        this.applyForceV2()
        this.integrate()
    }

    applyForceV2() {
        let p1 = new Vec2(this.p1.x, this.p1.y)
        let p2 = new Vec2(this.p2.x, this.p2.y)
        let v1 = new Vec2(this.p1.vx, this.p1.vy)
        let v2 = new Vec2(this.p2.vx, this.p2.vy)

        let length = p2.sub(p1).length()
        let direction = p2.sub(p1).normalize()

        if (length > this.max * this.restLength) {
            let center = p1.add(p2).divideScalar(2)
            let pos1 = center.sub(direction.multiplyScalar(this.restLength * this.max / 2))
            let pos2 = center.add(direction.multiplyScalar(this.restLength * this.max / 2))
            this.p1.x = pos1.x
            this.p1.y = pos1.y
            this.p2.x = pos2.x
            this.p2.y = pos2.y
        }
        if (length < this.min * this.restLength) {
            let center = p1.add(p2).divideScalar(2)
            let pos1 = center.sub(direction.multiplyScalar(this.restLength * this.min / 2))
            let pos2 = center.add(direction.multiplyScalar(this.restLength * this.min / 2))
            this.p1.x = pos1.x
            this.p1.y = pos1.y
            this.p2.x = pos2.x
            this.p2.y = pos2.y
        }

        // 胡克定律
        let fs = direction.multiplyScalar(this.ks).multiplyScalar(length - this.restLength)
        let fd = direction.multiplyScalar(v2.sub(v1).dot(direction)).multiplyScalar(this.kd)

        let f = fs.add(fd)

        // 叠加 acceleration 来处理多种力
        this.p1.acceleration.x += f.x / this.p1.mass
        this.p1.acceleration.y += f.y / this.p1.mass

        this.p2.acceleration.x += -f.x / this.p2.mass
        this.p2.acceleration.y += -f.y / this.p2.mass
    }

    integrate() {
        this.integrateForPoint(this.p1)
        this.integrateForPoint(this.p2)
    }

    integrateForPoint(point: Point) {
        // dt 是时间上的步进
        let dt = 0.001

        // f = ma -> a = f / m
        point.vx += point.acceleration.x * dt
        point.x += point.vx * dt
        point.vy += point.acceleration.y * dt
        point.y += point.vy * dt
    }

    draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        context.beginPath()
        context.moveTo(this.p1.x, this.p1.y)
        context.lineTo(this.p2.x, this.p2.y)

        context.stroke()
    }
}

const __main = () => {
    let canvas = document.querySelector('canvas')
    let context = canvas.getContext('2d')

    let canvasRect = canvas.getBoundingClientRect()

    // let springs = []
    // let num = 10
    // let radius = 50
    // let pi = Math.PI
    //
    // let points = []
    //
    // context.rect(100, 100, 1, 1)
    //
    // for (let i = 1; i <= num; i++) {
    //     // 从 12 点方向顺时针旋转
    //     let x = 100 + radius * Math.sin(2 * pi * i / num)
    //     let y = 100 + radius * Math.cos(2 * pi * i / num)
    //     points[i] = [x, y]
    //
    //     context.rect(x, y, 1, 1)
    // }

    // for(let i = 1; i <= num; i++) {
    //     // AddSpring(i,i,i+1); AddSpring(i-1,i-1,1);
    //     // i -> i+1
    //     // i-1 -> 1
    //     let p = points[i]
    //     let pp1 = points[i + 1]
    //     let pm1 = points[i - 1]
    //     let one = points[1]
    //
    //     if (p && pp1) {
    //         context.moveTo(p[0], p[1])
    //         context.lineTo(pp1[0], pp1[1])
    //     }
    //
    //     if (pm1 && one) {
    //         context.moveTo(pm1[0], pm1[1])
    //         context.lineTo(one[0], one[1])
    //     }
    // }

    // context.stroke()

    let p1 = new Point(100, 100)
    let p2 = new Point(100, 120)
    let p3 = new Point(140, 140)
    let s1 = new Spring(p1, p2, 100)
    let s2 = new Spring(p2, p3, 100)
    let s3 = new Spring(p3, p1, 100)

    let mouseDown = false
    let mouseX = 0
    let mouseY = 0
    let mouseOnPoint = null

    canvas.addEventListener('mousedown', (event) => {
        let x = event.clientX - canvasRect.x
        let y = event.clientY - canvasRect.y

        for (let point of [p1, p2, p3]) {
            if (Math.abs(x - point.x) < 10 && Math.abs(y - point.y) < 10) {
                mouseDown = true
                mouseOnPoint = point
            }
        }
    })

    canvas.addEventListener('mousemove', (event) => {
        if (mouseDown) {
            let x = event.clientX - canvasRect.x
            let y = event.clientY - canvasRect.y

            mouseX = x
            mouseY = y

            mouseOnPoint.x = mouseX
            mouseOnPoint.y = mouseY
        }
    })

    canvas.addEventListener('mouseup', (event) => {
        mouseOnPoint = null
        mouseDown = false
    })


    const run = () => {
        context.clearRect(0, 0, 1000, 1000)

        s1.update()
        s1.draw(canvas, context)
        s2.update()
        s2.draw(canvas, context)
        s3.update()
        s3.draw(canvas, context)

        setTimeout(() => run(), 1000 / 60)
    }

    run()
}

__main()
