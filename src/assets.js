import {
  Assets,
  SCALE_MODES,
  TilingSprite,
  Sprite,
  AnimatedSprite,
} from "pixi.js";

const PIXEL_TEXTURE_WIDTH = 320;
const PIXEL_TEXTURE_HEIGHT = 180;

export async function loadBackground() {
  const sheet = await Assets.load("/assets/grassy.json");
  // Set scale mode to nearest to ensure sharp pixels.
  sheet.textures["grassy (Grass).aseprite"].baseTexture.scaleMode =
    SCALE_MODES.NEAREST;
  sheet.textures["grassy (Sky).aseprite"].baseTexture.scaleMode =
    SCALE_MODES.NEAREST;
  return sheet;
}

// Note this will result in some cutting off of the bottom of the foreground,
// since the tile scale goes from the anchor, in this case top left.
// This is okay since it gives us a more consisten horizon line.
// See applyAnchorToTexture.
function calculatePixelScale(
  screenWidth,
  screenHeight,
  spriteWidth = PIXEL_TEXTURE_WIDTH,
  spriteHeight = PIXEL_TEXTURE_HEIGHT,
) {
  // Calculate the scale needed to make the texture fill the width.
  const scaleX = screenWidth / spriteWidth;
  // Calculate the scale needed to make the texture fill the height.
  const scaleY = screenHeight / spriteHeight;
  // We want a uniform integer scale to maintain the pixel art look.
  // Math.ceil(Math.max(scaleX, scaleY)) ensures the scaled tile is always
  // large enough to cover the screen in both dimensions, and it's an integer.
  return Math.max(1, Math.ceil(Math.max(scaleX, scaleY)));
}

export function pixelDistance(x, app) {
  return x * calculatePixelScale(app.screen.width, app.screen.height);
}

export function getFrames(atlas, prefix) {
  const frames = [];
  for (const [frameName, texture] of Object.entries(atlas.textures)) {
    if (frameName.startsWith(prefix)) {
      frames.push(texture);
    }
  }
  return frames;
}

export async function loadCharacters(path) {
  const sheet = await Assets.load(path);
  let textureArray = sheet._frameKeys.map((key) => {
    sheet.textures[key].baseTexture.scaleMode = SCALE_MODES.NEAREST;
    return sheet.textures[key];
  });
  // Set scale mode to nearest to ensure sharp pixels.
  return textureArray;
}

export function setScaleRelativeToViewHeightOrMaxWidth(vh, sprite, app) {
  const originalWidth = sprite.width;
  const desiredHeight = vh * app.screen.height;
  const scaleY = desiredHeight / sprite.height;
  sprite.scale.set(scaleY);
  // If the photo bleeds plast the sides, scale down to max width of screen.
  if (sprite.width > app.screen.width) {
    const scaleX = app.screen.width / originalWidth;
    sprite.scale.set(scaleX);
    return scaleX;
  }
  return scaleY;
}

export function setScaleRelativeToViewWidth(vw, sprite, app) {
  const desiredHeight = vw * app.screen.height;
  const scaleX = desiredHeight / sprite.height;
  sprite.scale.set(scaleX);
  return scaleX;
}

// Scales all fixed sprites.
export function getScaledSprite(texture, app) {
  const sprite = new Sprite(texture);
  let currentPixelScale = calculatePixelScale(
    app.screen.width,
    app.screen.height,
  );
  sprite.scale.set(currentPixelScale, currentPixelScale);
  return sprite;
}

// Scales all animated sprites.
export function getScaledAnimatedSprite(frames, app) {
  const sprite = new AnimatedSprite(frames);
  let currentPixelScale = calculatePixelScale(
    app.screen.width,
    app.screen.height,
  );
  sprite.scale.set(currentPixelScale, currentPixelScale);
  return sprite;
}

// Scales all background tiling sprites.
export function getScaledBackgroundSprite(texture, app) {
  const sprite = new TilingSprite({
    texture: texture,
    width: app.screen.width,
    height: app.screen.height,
  });
  let currentPixelScale = calculatePixelScale(
    app.screen.width,
    app.screen.height,
  );
  sprite.tileScale.set(currentPixelScale, currentPixelScale);
  return sprite;
}

