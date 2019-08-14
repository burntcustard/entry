import { Sprite } from 'kontra';
import * as util from './utility';

export class Ship extends Sprite.class {
    render() {
        this.context.save();

        // Rotate
        this.context.translate(this.x, this.y);
        this.context.rotate(util.degToRad(this.rotation));

        // Draw
        this.context.strokeStyle = this.color;
        this.context.beginPath();
        this.context.moveTo(-3, -5);
        this.context.lineTo(12, 0);
        this.context.lineTo(-3, 5);
        this.context.closePath();
        this.context.stroke();

        this.context.restore();
    }

    shipUpdate() {
        this.advance();
        // Max speed
        const magnitude = Math.sqrt(this.dx * this.dy + this.dy * this.dy);
        if (magnitude > 3) {
            this.dx *= .95;
            this.dy *= .95;
        } else {
            if (Math.abs(this.dx) > .01) {
                this.dx *= .99;
            }
            if (Math.abs(this.dy) > .01) {
                this.dy *= .99;
            }
        }
    }
}