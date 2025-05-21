import {
  Application,
  Assets,
  Sprite,
  Spritesheet,
  TilingSprite,
  SCALE_MODES,
} from "pixi.js";

(async () => {
  // Create a new application
  const app = new Application();

  let container = document.getElementById("stage");
  // Initialize the application
  await app.init({
    background: "#1099bb",
    resizeTo: container,
    autoDensity: true,
    antialiasing: false,
    hello: true,
  });
  // Log the device pixel ratio and PixiJS renderer's resolution for debugging purposes.
  // On a Retina display, window.devicePixelRatio will typically be 2 or 3.
  // app.renderer.resolution should match this value when autoDensity is true.
  console.log("Device Pixel Ratio:", window.devicePixelRatio);
  console.log("PixiJS Renderer Resolution:", app.renderer.resolution);

  const PIXEL_TEXTURE_WIDTH = 320;
  const PIXEL_TEXTURE_HEIGHT = 180;
  const FOREGROUND_LAYER_FACTOR = 1;
  const SKY_LAYER_FACTOR = 0.05;

  // Append the application canvas to the document body
  container.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("https://pixijs.com/assets/bunny.png");
  const sheet = await Assets.load("/assets/grassy.json");
  // Set scale mode to nearest to ensure sharp pixels.
  sheet.textures["grassy (Grass).aseprite"].baseTexture.scaleMode =
    SCALE_MODES.NEAREST;
  sheet.textures["grassy (Sky).aseprite"].baseTexture.scaleMode =
    SCALE_MODES.NEAREST;

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

  // Create a bunny Sprite
  const bunny = new Sprite(texture);
  const foreground = new TilingSprite({
    texture: sheet.textures["grassy (Grass).aseprite"],
    width: app.screen.width,
    height: app.screen.height,
  });
  const sky = new TilingSprite({
    texture: sheet.textures["grassy (Sky).aseprite"],
    width: app.screen.width,
    height: app.screen.height,
  });
  let currentPixelScale = calculatePixelScale(
    app.screen.width,
    app.screen.height,
  );
  console.log("scale");
  console.log(currentPixelScale);
  foreground.tileScale.set(currentPixelScale, currentPixelScale);
  sky.tileScale.set(currentPixelScale, currentPixelScale);

  // Layout
  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;
  console.log("Screen size");
  console.log(app.screen.width);
  console.log(app.screen.height);
  console.log("Center is at");
  console.log(app.screen.width / 2);
  console.log(app.screen.height / 2);

  // Resize logic
  // --- Responsive Resizing Logic for PixiJS Elements ---
  // While `resizeTo: container` handles the canvas itself, we need to manually
  // update the dimensions of our scene elements (like TilingSprites) and
  // reposition sprites (like the bunny) when the logical screen size changes.
  function handleResize() {
    // Update TilingSprite dimensions to fill the new logical screen size.
    foreground.width = app.screen.width;
    foreground.height = app.screen.height;
    sky.width = app.screen.width;
    sky.height = app.screen.height;

    // Reposition the bunny to the new center of the screen.
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;

    // Re-calculate the animation scroll length, as the document layout might change on resize.
    //updateAnimationScrollLength();
    // Also, immediately update the animation state to reflect the new layout.
    updateAnimation();
  }

  // Attach the `handleResize` function to the PixiJS renderer's 'resize' event.
  // This event fires whenever the canvas dimensions change (e.g., when the browser window is resized).
  app.renderer.on("resize", handleResize);

  // Animation logic
  const documentLength =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const preambleHeight = document.getElementById("preamble").clientHeight;
  const animationScrollLength = documentLength - preambleHeight;
  let currentScrollY = window.scrollY;
  let animationScrollY =
    currentScrollY - preambleHeight > 0 ? currentScrollY - preambleHeight : 0;
  let scrollFraction = 0;
  let deltaY = 0;

  console.log("Preamble height");
  console.log(preambleHeight);

  function updateAnimation() {
    // Calculate scroll progress (0 to 1)
    deltaY = window.scrollY - currentScrollY;
    currentScrollY = window.scrollY;
    animationScrollY =
      currentScrollY - preambleHeight > 0 ? currentScrollY - preambleHeight : 0;
    scrollFraction =
      animationScrollY > 0 ? animationScrollY / animationScrollLength : 0;

    // Update character position/animation based on scroll progress (basic example)
    // For a walk cycle, you would change sprite frames here
    // character.y = (app.screen.height / 2 - character.height / 2) + (scrollProgress * 50); // Example: move character down slightly
    console.log(animationScrollY);
    console.log(scrollFraction);
    bunny.x = app.renderer.width * scrollFraction;
    foreground.tilePosition.x -= deltaY * FOREGROUND_LAYER_FACTOR;
    sky.tilePosition.x -= deltaY * SKY_LAYER_FACTOR;
  }
  window.addEventListener("scroll", () => {
    // Use requestAnimationFrame to ensure updates happen before the next repaint
    requestAnimationFrame(updateAnimation);
  });

  // Staging
  app.stage.addChild(sky);
  app.stage.addChild(foreground);
  app.stage.addChild(bunny);

  bunny.x;

  // Listen for animate update
  app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    bunny.rotation += 0.1 * time.deltaTime;
  });
})();
