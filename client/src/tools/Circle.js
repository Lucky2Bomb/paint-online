import Tool from "./Tool";

export default class Circle extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
    }

    listen() {
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;
            this.draw(this.startX, this.startY, this.currentX, this.currentY);
        }
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: "draw",
            id: this.id,
            figure: {
                type: "circle",
                x1: this.startX,
                y1: this.startY,
                x2: this.currentX,
                y2: this.currentY,
                color: this.ctx.fillStyle
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL();
    }

    draw(x1, y1, x2, y2) {
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            this.ctx.arc(x1, y1, this.distanceBetweenPoints(x1, y1, x2, y2), 0, Math.PI * 2, true);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    distanceBetweenPoints(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    static staticDraw(ctx, x1, y1, x2, y2, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x1, y1, Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
    }

}