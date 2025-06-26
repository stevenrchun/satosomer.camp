import { Container } from "pixi.js";

/**
 * A sprite container for PixiJS that applies a parallax effect to its position
 * and cascades the effect to its children.
 * @extends PIXI.Container
 */
export class ParallaxScene {
  /**
   * @param {number} [parallaxFactor=1] - The factor to apply to movement. 0 means no movement, 1 means full movement.
   * @param {PIXI.DisplayObject} [sprite=null] - An optional PIXI.DisplayObject (like a Sprite or Graphics) to add to this container.
   */
  constructor(parallaxChildren = null) {
    this._parallaxChildren = parallaxChildren ? parallaxChildren : [];
  }

  addParallaxChild(sprite) {
    this._parallaxChildren.push(sprite);
  }

  // Getter
  parallaxChildren() {
    return this._parallaxChildren;
  }

  /**
   * Moves the sprite by a given delta, applying the parallax effect and
   * propagating the movement to its children.
   * @param {number} deltaX - The amount to move in the x-direction.
   */
  moveX(deltaX) {
    // Propagate the movement to any children that are also ParallaxSprites.
    for (const child of this._parallaxChildren) {
      if (child instanceof ParallaxSprite) {
        // Pass the *visual* movement of this parent container to the child.
        child.moveParallaxSpriteX(deltaX);
      }
    }
  }
}

export class ParallaxSprite extends Container {
  constructor(sprite, parallaxFactor = 1) {
    super();
    this._parallaxFactor = parallaxFactor;
    this.sprite = sprite;
    if (sprite) {
      this.addChild(this.sprite);
    }
  }
  moveParallaxSpriteX(deltaX) {
    this.x += deltaX * this._parallaxFactor;
  }
}
