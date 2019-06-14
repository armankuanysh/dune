import * as PIXI from "pixi.js";
import Particle from "./Particle";

export default class Dune {
  constructor(pic, picWidth, picHeight) {
    pic.setAttribute("style", "display: none;");

    // Getting the wrapper element of the picture
    this.myContainer = pic.parentElement;

    // Taking an width and height of the wrapper
    this.myContainerWidth = this.myContainer.offsetWidth;
    this.myContainerHeight = this.myContainer.offsetHeight;

    // Creating PIXI application
    this.app = new PIXI.Application(
      this.myContainerWidth,
      this.myContainerHeight,
      {
        resolution: window.devicePixelRatio,
        autoResize: true,
        transparent: true
      }
    );

    // Adding PIXI application to the wrapper
    this.myContainer.appendChild(this.app.view);

    // Calculating a sum of a columns and rows of the image
    this.particleSize = 2;
    this.rows = Math.floor(picHeight / this.particleSize);
    this.cols = Math.floor(picWidth / this.particleSize);

    // Empty matrix of a particles
    this.particles = [];

    // Centering canvas image in the wrapper
    this.contCols = (this.myContainerWidth - this.particleSize * this.cols) / 2;
    this.contRows =
      (this.myContainerHeight - this.particleSize * this.rows) / 2;

    this.container = new PIXI.ParticleContainer(40000);

    this.app.stage.addChild(this.container);

    // Taking source of the image
    this.picDir = pic.getAttribute("src");

    this.addObjects(this.picDir);
  }

  addObjects(pic) {
    // Loading our image as a texture
    PIXI.loader.add("bunny", pic).load((loader, resources) => {
      // Creating canvas
      const canvas = document.createElement("canvas");
      canvas.classList.add("myCanvas");
      const ctx = canvas.getContext("2d", { alpha: false });

      canvas.width = this.cols * this.particleSize;
      canvas.height = this.rows * this.particleSize;
      ctx.drawImage(resources.bunny.data, 0, 0);

      // Checking our image
      function hasFill(x, y, size) {
        for (let i = 0; i < size; i += 1) {
          for (let j = 0; j < size; j += 1) {
            if (ctx.getImageData(x + i, y + i, 1, 1).data[2] > 0) return true;
          }
        }
        return false;
      }

      // Dividing our image into particles
      for (let i = 0; i < this.cols; i += 1) {
        for (let j = 0; j < this.rows; j += 1) {
          if (
            hasFill(
              i * this.particleSize,
              j * this.particleSize,
              this.particleSize
            )
          ) {
            const p = new Particle(
              i * this.particleSize,
              j * this.particleSize,
              resources.bunny.texture,
              this.particleSize,
              this.contCols,
              this.contRows
            );
            this.particles.push(p);
            this.container.addChild(p.sprite);
          }
        }
      }

      this.animate();
    });
  }

  animate() {
    // Animating our canvas using physic from 'Particle' class
    this.app.ticker.add(() => {
      this.mouse = this.app.renderer.plugins.interaction.mouse.global;
      this.particles.forEach(p => {
        p.update(this.mouse);
      });
    });
  }
}
