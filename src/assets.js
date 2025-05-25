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
function calculatePixelScale(screenWidth, screenHeight) {
  // Calculate the scale needed to make the texture fill the width.
  const scaleX = screenWidth / PIXEL_TEXTURE_WIDTH;
  // Calculate the scale needed to make the texture fill the height.
  const scaleY = screenHeight / PIXEL_TEXTURE_HEIGHT;
  // We want a uniform integer scale to maintain the pixel art look.
  // Math.ceil(Math.max(scaleX, scaleY)) ensures the scaled tile is always
  // large enough to cover the screen in both dimensions, and it's an integer.
  return Math.max(1, Math.ceil(Math.max(scaleX, scaleY)));
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
