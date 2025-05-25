import {
  Application,
  Assets,
  Sprite,
  Spritesheet,
  TilingSprite,
  SCALE_MODES,
} from "pixi.js";
import {
  getScaledBackgroundSprite,
  getScaledSprite,
  getScaledAnimatedSprite,
  loadBackground,
  loadCharacters,
} from "./assets.js";

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

  const FOREGROUND_LAYER_FACTOR = 1;
  const SKY_LAYER_FACTOR = 0.05;
  const CHARACTER_ANIMATION_SPEED = 0.2;

  // Append the application canvas to the document body
  container.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load("https://pixijs.com/assets/bunny.png");
  const sheet = await loadBackground();
  const rachel_idle_texture = await loadCharacters("/assets/rachel_idle.json");
  const rachel_walk_texture = await loadCharacters("/assets/rachel_walk.json");
  const rachelAnimations = {
    idle: rachel_idle_texture,
    walking: rachel_walk_texture,
  };

  // Create a bunny Sprite
  const bunny = new Sprite(texture);
  // Just using the initial texture
  const rachelSprite = getScaledAnimatedSprite(rachelAnimations.idle, app);

  const foreground = getScaledBackgroundSprite(
    sheet.textures["grassy (Grass).aseprite"],
    app,
  );
  const sky = getScaledBackgroundSprite(
    sheet.textures["grassy (Sky).aseprite"],
    app,
  );

  // Layout
  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Set initial positions
  bunny.x = app.screen.width / 2;
  bunny.y = app.screen.height / 2;
  rachelSprite.anchor.set(0, 1);
  rachelSprite.y = app.screen.height * 0.9;
  rachelSprite.x = app.screen.width * 0.1;
  rachelSprite.animationSpeed = CHARACTER_ANIMATION_SPEED;
  rachelSprite.play();
  console.log("Screen size");
  console.log(app.screen.width);
  console.log(app.screen.height);

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
  let scrollStopTimeoutId = null;
  let charactersAreWalking = false;

  console.log("Preamble height");
  console.log(preambleHeight);

  function updateAnimation() {
    // Calculate scroll progress (0 to 1)
    deltaY = window.scrollY - currentScrollY;
    // Scale the animation speed with deltaY
    if (charactersAreWalking) {
      rachelSprite.animationSpeed = Math.abs(deltaY) / 50;
    }
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
    clearTimeout(scrollStopTimeoutId);

    if (!charactersAreWalking) {
      // If not already walking, switch to walking animation
      console.log("Scroll detected: Rachel starts walking.");
      rachelSprite.textures = rachelAnimations.walking;
      rachelSprite.play(); // Make sure animation is playing
      charactersAreWalking = true;
    }

    scrollStopTimeoutId = setTimeout(() => {
      console.log("Scroll stopped: Rachel goes idle.");
      rachelSprite.textures = rachelAnimations.idle;
      rachelSprite.animationSpeed = CHARACTER_ANIMATION_SPEED;
      rachelSprite.play(); // Make sure animation is playing
      charactersAreWalking = false;
    }, 300);

    // Use requestAnimationFrame to ensure updates happen before the next repaint
    requestAnimationFrame(updateAnimation);
  });

  // Staging
  app.stage.addChild(sky);
  app.stage.addChild(foreground);
  app.stage.addChild(bunny);
  app.stage.addChild(rachelSprite);

  bunny.x;

  // Listen for animate update
  app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    bunny.rotation += 0.1 * time.deltaTime;
  });
})();
