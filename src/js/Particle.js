import * as PIXI from "pixi.js";

export default class Particle {
  constructor(x, y, texture, size, contCols, contRows) {
    // Setting coordinates of each particle
    this.x = x + contCols;
    this.y = y + contRows;

    // Creating each particle
    this.sprite = new PIXI.Sprite(new PIXI.Texture(texture));
    this.sprite.texture.frame = new PIXI.Rectangle(x, y, size, size);
    this.sprite.anchor.set(0.5);

    // -- Defining variables to create interaction physics -- //

    // Defining a speed of particles
    this.speedX = 0;
    this.speedY = 0;

    // Defining a radius of the impact
    this.radius = 100;

    // Defining a friction force
    this.friction = 0.9;

    // Defining a force of gravity
    this.gravity = 0.01;
    this.maxGravity = 0.01 + Math.random() * 0.03;

    // Defining a direction of each particle moving
    this.dirX = Math.random() - 0.5;
    this.dirY = Math.random() - 0.5;
  }

  update(mouse) {
    // Getting a distance between mouse and particle coordinates
    const distanceX = mouse.x - this.sprite.x;
    const distanceY = mouse.y - this.sprite.y;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    const normalX = distanceX / distance;
    const normalY = distanceY / distance;

    // Creating a interaction animation
    if (distance < this.radius) {
      this.gravity *= this.friction;
      this.speedX -= normalX;
      this.speedY -= normalY;
    } else {
      this.gravity += 0.1 * (this.maxGravity - this.gravity);
    }

    // Pulling the particles to their origin coordinates
    const oDistX = this.x - this.sprite.x;
    const oDistY = this.y - this.sprite.y;
    this.speedX += oDistX * this.gravity;
    this.speedY += oDistY * this.gravity;

    this.speedX *= this.friction;
    this.speedY *= this.friction;
    this.sprite.x += this.speedX;
    this.sprite.y += this.speedY;
  }
}
