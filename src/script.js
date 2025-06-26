import {
  Application,
  Assets,
  Sprite,
  SCALE_MODES,
  Graphics,
  Container,
  Text,
} from "pixi.js";
import {
  getScaledBackgroundSprite,
  getScaledSprite,
  getScaledAnimatedSprite,
  pixelDistance,
  getFrames,
  setScaleRelativeToViewHeightOrMaxWidth,
} from "./assets.js";
import { ParallaxSprite, ParallaxScene } from "./parallax.js";
import { initDevtools } from "@pixi/devtools";

const POST_WIDTH = 400;

// Module-level variables for confetti management
const confettiPieces = [];
const confettiColors = [
  0xff004d, 0xffa300, 0xffec27, 0x00e436, 0x29adff, 0x8337ff, 0xffffff,
  0x000000,
];
let confettiTickerAdded = false;
let shouldProduceConfetti = false; // Controls continuous production

function createConfetti(app) {
  const size = Math.random() * 15 + 5;
  const color =
    confettiColors[Math.floor(Math.random() * confettiColors.length)];

  const confetti = new Graphics().rect(0, 0, size, size).fill(color);
  confetti.zIndex = 100;

  confetti.x = Math.random() * app.screen.width;
  confetti.y = -size;
  console.log("initial x " + confetti.x);
  console.log("initial y " + confetti.y);

  confetti.vx = (Math.random() - 0.5) * 2;
  confetti.vy = Math.random() * 2 + 1;
  confetti.rotationSpeed = (Math.random() - 0.5) * 0.1;

  app.stage.addChild(confetti);
  confettiPieces.push(confetti);
}

function startConfettiEffect(app) {
  if (!confettiTickerAdded) {
    console.log("starting");
    app.ticker.add((ticker) => {
      const gravity = 0.05;
      const wind =
        Math.sin(app.ticker.lastTime * 0.001) * 0.01 +
        (Math.random() - 0.5) * 0.02;

      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const confetti = confettiPieces[i];

        confetti.vy += gravity * ticker.deltaTime;
        confetti.vx += wind * ticker.deltaTime;

        confetti.x += confetti.vx * ticker.deltaTime;
        confetti.y += confetti.vy * ticker.deltaTime;
        console.log("delta" + ticker.deltaTime);
        console.log(confetti.x);
        console.log(confetti.y);

        confetti.rotation += confetti.rotationSpeed * ticker.deltaTime;

        if (
          confetti.y > app.screen.height + 10 ||
          confetti.x < -10 ||
          confetti.x > app.screen.width + 10
        ) {
          app.stage.removeChild(confetti);
          confetti.destroy();
          confettiPieces.splice(i, 1);
        }
      }

      if (shouldProduceConfetti && Math.random() < 0.4 * ticker.deltaTime) {
        createConfetti(app);
      }
    });
    confettiTickerAdded = true;
  }

  for (let i = 0; i < 75; i++) {
    createConfetti(app);
  }
  shouldProduceConfetti = true;
}

function stopConfettiProduction() {
  shouldProduceConfetti = false;
}
function addSignpost(sprite, text, scaleY) {
  const STROKE_WIDTH = 64;
  const TEXT_BACKGROUND_PADDING = 64;
  const border = new Graphics()
    .rect(
      -sprite.texture.width / 2,
      -sprite.texture.height / 2,
      sprite.texture.width,
      sprite.texture.height,
    )
    .stroke({
      width: STROKE_WIDTH,
      color: 0xffffff,
      join: "round",
    });
  const post = new Graphics()
    .rect(-POST_WIDTH / 2, sprite.texture.height / 2, 400, 10000)
    .fill(0xffffff);
  const textObject = new Text({
    text: text,
    style: {
      fill: "#000000",
      fontSize: 20 * (1 / scaleY), // Invert the inherited scaling.
      align: "center",
      wordWrap: true,
      wordWrapWidth:
        sprite.texture.width + STROKE_WIDTH - TEXT_BACKGROUND_PADDING,
    },
    anchor: { x: 0.5, y: 0 },
  });
  const textBackground = new Graphics()
    .rect(
      -textObject.width / 2 + -TEXT_BACKGROUND_PADDING,
      0,
      textObject.width + TEXT_BACKGROUND_PADDING * 2,
      textObject.height + TEXT_BACKGROUND_PADDING * 2,
    )
    .fill(0xffffff);

  const textContainer = new Container();
  textContainer.anchor = { x: 0.5, y: 0 };
  textContainer.y += sprite.texture.height / 2;
  textObject.y += TEXT_BACKGROUND_PADDING;
  textContainer.addChild(textBackground);
  textContainer.addChild(textObject);
  sprite.addChild(border);
  sprite.addChild(post);
  sprite.addChild(textContainer);
}

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

  initDevtools({ app });
  // Log the device pixel ratio and PixiJS renderer's resolution for debugging purposes.
  // On a Retina display, window.devicePixelRatio will typically be 2 or 3.
  // app.renderer.resolution should match this value when autoDensity is true.
  console.log("Device Pixel Ratio:", window.devicePixelRatio);
  console.log("PixiJS Renderer Resolution:", app.renderer.resolution);
  console.log("App.Screen.Height:", app.screen.height);
  console.log("App.Screen.width:", app.screen.width);

  // Append the application canvas to the document body
  container.appendChild(app.canvas);

  // Load atlas
  const atlas = await Assets.load("/assets/sprites-sheet.json");
  // Set all assets to scale to nearest
  // This might be bad for images idk
  atlas._frameKeys.map((key) => {
    atlas.textures[key].baseTexture.scaleMode = SCALE_MODES.NEAREST;
  });

  const rachel_idle_texture = getFrames(atlas, "rachel_idle");
  const rachel_walk_texture = getFrames(atlas, "rachel_walk");
  const ben_idle_texture = getFrames(atlas, "ben_idle");
  const ben_walk_texture = getFrames(atlas, "ben_walk");
  const formal1 = new Sprite(atlas.textures["formal1-0"]);
  const camp2 = new Sprite(atlas.textures["camp2-0"]);
  const bus3 = new Sprite(atlas.textures["bus3-0"]);
  const grad4 = new Sprite(atlas.textures["ben_grad-0"]);
  const grad5 = new Sprite(atlas.textures["rachel_grad-0"]);
  const park6 = new Sprite(atlas.textures["park6-0"]);
  const hayes7 = new Sprite(atlas.textures["hayes7-0"]);
  const hayesformal8 = new Sprite(atlas.textures["hayesformal8-0"]);
  const mattress9 = new Sprite(atlas.textures["mattress9-0"]);
  const pergola10 = new Sprite(atlas.textures["pergola10-0"]);
  const proposal11 = new Sprite(atlas.textures["proposal11-0"]);
  const goodbye11 = new Sprite(atlas.textures["goodbye11-0"]);
  const europe = new Sprite(atlas.textures["europe-0"]);
  const chicago_texture = atlas.textures["chicago-0"];
  const paintedLadiesTexture = atlas.textures["paintedladies-0"];
  const deering_texture = atlas.textures["deering-0"];
  const weber_texture = atlas.textures["weber-0"];
  const hayesHouseTexture = atlas.textures["958-0"];

  // Make sprites
  const rachelAnimations = {
    idle: rachel_idle_texture,
    walking: rachel_walk_texture,
  };
  const benAnimations = {
    idle: ben_idle_texture,
    walking: ben_walk_texture,
  };
  const parallaxContainer = new ParallaxScene();
  const rachelSprite = getScaledAnimatedSprite(rachelAnimations.idle, app);
  const benSprite = getScaledAnimatedSprite(benAnimations.idle, app);
  const imgSprites = [
    [formal1, "2017: Ben and Rachel meet at Northwestern (RIP La Mach)."],
    [
      camp2,
      "They go on a few adventures (including Ben’s first camping trip).",
    ],
    [bus3, "They share a lot of laughs and make lots of good memz."],
    [grad4, "In 2019, Ben graduates and moves to San Francsico."],
    [
      grad5,
      "2020: Rachel graduates and “temporarily” moves to SF because of COVID.",
    ],
    [park6, "Lots of good park hangs during the Pandemic."],
    [
      hayes7,
      "2021: Ben and Rachel move into the Hayes House with 7 other friends. Chaos and lifelong friendships ensue. ",
    ],
    [
      europe,
      "2022: The couple travel through Europe for 3 months, London, Paris, Barcelona.",
    ],
    [hayesformal8, "The Era of the Hayes House comes to a close."],
    [
      mattress9,
      "Late 2023, Ben and Rachel move in together, carrying their mattress across Alamo Square.",
    ],
    [
      pergola10,
      "In Rachel and Ben's new home, a pergola is built. Only takes a few weeks and a lot of free labor from friends.",
    ],
    [
      proposal11,
      "In December of 2023, the Perg Prosposal happens. It's a perfect moment in the new home captured by a few sneaky hidden cameras.",
    ],
    [
      goodbye11,
      "JUST THE START: We’re so excited to celebrate with you all at Sato Somer Camp <3",
    ],
  ];

  const chicago = getScaledSprite(chicago_texture, app);
  const paintedLadies = getScaledSprite(paintedLadiesTexture, app);
  const weber = getScaledSprite(weber_texture, app);
  const deering = getScaledSprite(deering_texture, app);
  const hayesHouse = getScaledSprite(hayesHouseTexture, app);
  const tower = getScaledSprite(atlas.textures["eiffel-0"], app);
  const eiffelBushes = getScaledSprite(atlas.textures["bushes-0"], app);
  const foreground = getScaledBackgroundSprite(atlas.textures["grassy-0"], app);
  const sky = getScaledBackgroundSprite(atlas.textures["sky-0"], app);
  const perg = getScaledSprite(atlas.textures["perg-0"], app);

  // Layout
  // how far along x you have to be to be roughly in the right of the frame after the initial scrolling.
  // At least for images..
  // Screen size dependent.
  const documentLength =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const preambleHeight = document.getElementById("preamble").clientHeight;
  const transitionHeight =
    document.getElementById("transition-id").clientHeight;
  // FOREGROUND_LAYER_FACTOR is also the "world" base parallax scroll. Really it's not a parallax factor, but a ratio of how many vertical pixels should translate to horizontal scrolls.
  const FOREGROUND_LAYER_FACTOR = 0.3;
  const CHICAGO_LAYER_FACTOR = 0.2;
  const SPECIFIC_BUILDING_LAYER_FACTOR = 0.23;
  const IMAGE_LAYER_FACTOR = 0.25;
  const SKY_LAYER_FACTOR = 0.02;

  // Define a consistent ground level for all sprites
  const GROUND_LEVEL_Y = app.screen.height * 0.87; // Adjust this percentage as needed
  // This is the pixel distance from the top of the 'grassy-0' texture to its visual ground.
  // You will need to adjust this value to align the foreground's visual ground with GROUND_LEVEL_Y.
  const FOREGROUND_VISUAL_GROUND_OFFSET = 129; // Initial guess, adjust as needed

  // Set initial positions
  // Position foreground based on its visual ground
  foreground.y =
    GROUND_LEVEL_Y - FOREGROUND_VISUAL_GROUND_OFFSET * foreground.tileScale.y;

  // Position other sprites relative to GROUND_LEVEL_Y based on their anchors
  chicago.y = GROUND_LEVEL_Y - chicago.height; // Assuming anchor (0,0)
  chicago.x = app.screen.width + pixelDistance(100, app);

  paintedLadies.y = GROUND_LEVEL_Y - paintedLadies.height; // Assuming anchor (0,0)
  paintedLadies.x = app.screen.width + pixelDistance(600, app);

  weber.x = app.screen.width;
  weber.y = GROUND_LEVEL_Y - weber.height; // Assuming anchor (0,0)

  deering.x = app.screen.width + pixelDistance(40, app);
  deering.y = GROUND_LEVEL_Y - deering.height; // Assuming anchor (0,0)

  tower.anchor.set(0.5, 0); // Anchor set to center-top
  eiffelBushes.anchor.set(0.5, 0); // Anchor set to center-top
  tower.y = GROUND_LEVEL_Y - tower.height;
  eiffelBushes.y = GROUND_LEVEL_Y - eiffelBushes.height;

  // Define the initial x-position for the Eiffel Tower group
  // This is the "placement in the scene" that the user wants to maintain
  const eiffelGroupInitialX = app.screen.width + pixelDistance(1180, app);

  // Set tower's initial x-position
  tower.x = eiffelGroupInitialX;

  // Calculate the animationScrollY at which the tower will be centered
  // This is the scroll point where the Eiffel Tower group should align
  const scrollYForEiffelCenter =
    (eiffelGroupInitialX - app.screen.width / 2) / CHICAGO_LAYER_FACTOR;

  // Calculate eiffelBushes' initial x-position so it also centers at scrollYForEiffelCenter
  eiffelBushes.x =
    app.screen.width / 2 +
    scrollYForEiffelCenter * (CHICAGO_LAYER_FACTOR + 0.02);

  hayesHouse.x = app.screen.width + pixelDistance(1280, app);
  hayesHouse.y = GROUND_LEVEL_Y - hayesHouse.height; // Assuming anchor (0,0)

  perg.x = app.screen.width + pixelDistance(1550, app);
  perg.y = GROUND_LEVEL_Y - perg.height + 60; // Assuming anchor (0,0)

  // Parallax Staging
  parallaxContainer.addParallaxChild(
    new ParallaxSprite(chicago, CHICAGO_LAYER_FACTOR),
  );
  parallaxContainer.addParallaxChild(
    new ParallaxSprite(paintedLadies, CHICAGO_LAYER_FACTOR),
  );
  parallaxContainer.addParallaxChild(
    new ParallaxSprite(deering, SPECIFIC_BUILDING_LAYER_FACTOR),
  );
  parallaxContainer.addParallaxChild(
    new ParallaxSprite(weber, SPECIFIC_BUILDING_LAYER_FACTOR + 0.03),
  );
  parallaxContainer.addParallaxChild(
    new ParallaxSprite(tower, CHICAGO_LAYER_FACTOR),
  );
  parallaxContainer.addParallaxChild(
    new ParallaxSprite(eiffelBushes, CHICAGO_LAYER_FACTOR + 0.02),
  );
  parallaxContainer.addParallaxChild(
    new ParallaxSprite(hayesHouse, CHICAGO_LAYER_FACTOR),
  );
  parallaxContainer.addParallaxChild(
    new ParallaxSprite(perg, CHICAGO_LAYER_FACTOR),
  );

  const imgParallaxSprites = imgSprites.map((spriteAndLabel, index) => {
    let sprite = spriteAndLabel[0];
    let label = spriteAndLabel[1];
    sprite.anchor.set(0.5); // Anchor set to center
    // Split based on vert or horizontal photos.
    let scale = null;
    scale = setScaleRelativeToViewHeightOrMaxWidth(0.4, sprite, app);
    sprite.x = (index + 1) * pixelDistance(180, app) + app.screen.width;
    sprite.y = app.screen.height / 2.7;

    const parallaxSprite = new ParallaxSprite(sprite, IMAGE_LAYER_FACTOR);
    parallaxContainer.addParallaxChild(parallaxSprite);
    addSignpost(sprite, label, scale);
    return parallaxSprite;
  });
  let finalSprite = imgParallaxSprites.slice(-1)[0].sprite;

  // In your script, after sprite layout is complete
  const goodbyeSprite = imgParallaxSprites.slice(-1)[0].sprite; // Get the actual sprite
  const initialX = finalSprite.x;
  const targetX = app.screen.width / 2;
  const horizontalDistanceToTravel = initialX - targetX;

  const totalScrollDistance = horizontalDistanceToTravel / IMAGE_LAYER_FACTOR;

  // Set the height of the buffer element
  const scrollBuffer = document.getElementById("scroll-buffer");
  scrollBuffer.style.height = `${totalScrollDistance}px`;

  // Now you can calculate your animationScrollLength based on this
  // instead of the total document height.

  // Character Positions
  const CHARACTER_ANIMATION_SPEED = 0.2;
  const CHARACTER_FOREGROUND_VISUAL_OFFSET = 145;
  rachelSprite.anchor.set(0, 1); // Anchor set to bottom-left
  // Anchor characters to the foreground.
  rachelSprite.y =
    GROUND_LEVEL_Y -
    FOREGROUND_VISUAL_GROUND_OFFSET * foreground.tileScale.y +
    CHARACTER_FOREGROUND_VISUAL_OFFSET * foreground.tileScale.y +
    20;
  rachelSprite.x = app.screen.width * 0.08;
  if (app.screen.height > app.screen.width) {
    rachelSprite.x = app.screen.width * 0.03;
  }
  rachelSprite.animationSpeed = CHARACTER_ANIMATION_SPEED;
  rachelSprite.play();

  benSprite.anchor.set(0, 1); // Anchor set to bottom-left
  benSprite.y =
    GROUND_LEVEL_Y -
    FOREGROUND_VISUAL_GROUND_OFFSET * foreground.tileScale.y +
    CHARACTER_FOREGROUND_VISUAL_OFFSET * foreground.tileScale.y;
  benSprite.x = app.screen.width * 0.12;
  if (app.screen.height > app.screen.width) {
    benSprite.x = app.screen.width * 0.2;
  }
  benSprite.animationSpeed = CHARACTER_ANIMATION_SPEED - 0.05;
  benSprite.play();
  benSprite.animationSpeed = CHARACTER_ANIMATION_SPEED - 0.05;
  benSprite.play();

  app.stage.sortableChildren = true;
  app.stage.addChild(sky);
  for (const child of parallaxContainer.parallaxChildren()) {
    app.stage.addChild(child);
  }
  // app.stage.addChild(formal1Sprite);
  app.stage.addChild(foreground);
  app.stage.addChild(benSprite);
  app.stage.addChild(rachelSprite);

  // Resize logic
  // --- Responsive Resizing Logic for PixiJS Elements ---
  // While `resizeTo: container` handles the canvas itself, we need to manually
  // update the dimensions of our scene elements (like TilingSprites) and
  // reposition sprites (like the bunny) when the logical screen size changes.
  //function handleResize() {
  //  // Update TilingSprite dimensions to fill the new logical screen size.
  //  foreground.width = app.screen.width;
  //  foreground.height = app.screen.height;
  //  sky.width = app.screen.width;
  //  sky.height = app.screen.height;

  //  // Re-calculate the animation scroll length, as the document layout might change on resize.
  //  //updateAnimationScrollLength();
  //  // Also, immediately update the animation state to reflect the new layout.
  //  updateAnimation();
  //}

  //// Attach the `handleResize` function to the PixiJS renderer's 'resize' event.
  //// This event fires whenever the canvas dimensions change (e.g., when the browser window is resized).
  //app.renderer.on("resize", handleResize);

  // Animation logic
  const animationScrollLength =
    documentLength - preambleHeight - transitionHeight;

  let currentScrollY = 0;
  let animationScrollY = 0; // This will be the effective scroll for animation
  let prevAnimationScrollY = 0; // Keep track of the previous animation scroll position
  let scrollFraction = 0;
  let scrollStopTimeoutId = null;
  let charactersAreWalking = false;
  let confettiEffectStarted = false; // Flag to track if confetti has started
  // Force the layout and move everything into place.
  requestAnimationFrame(updateAnimation);

  function updateAnimation() {
    // Calculate raw scroll change
    currentScrollY = window.scrollY;

    // Calculate animation-relevant scroll position
    const newAnimationScrollY = Math.max(
      0,
      currentScrollY - preambleHeight - transitionHeight,
    );
    const animationDeltaY = newAnimationScrollY - prevAnimationScrollY;
    prevAnimationScrollY = newAnimationScrollY;

    scrollFraction =
      newAnimationScrollY > 0 ? newAnimationScrollY / animationScrollLength : 0;

    foreground.tilePosition.x -= animationDeltaY * FOREGROUND_LAYER_FACTOR;
    sky.tilePosition.x -= animationDeltaY * SKY_LAYER_FACTOR;
    parallaxContainer.moveX(-animationDeltaY);

    const atEndOfScroll =
      currentScrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 5; // 5px tolerance

    if (atEndOfScroll) {
      if (!confettiEffectStarted) {
        console.log("Starting confetti effect");
        startConfettiEffect(app);
        confettiEffectStarted = true;
      }
    } else {
      if (confettiEffectStarted) {
        console.log("Stopping confetti production");
        stopConfettiProduction();
        confettiEffectStarted = false;
      }
    }
  }
  window.addEventListener("scroll", () => {
    clearTimeout(scrollStopTimeoutId);

    if (!charactersAreWalking) {
      // If not already walking, switch to walking animation
      rachelSprite.textures = rachelAnimations.walking;
      rachelSprite.play(); // Make sure animation is playing
      benSprite.textures = benAnimations.walking;
      benSprite.play(); // Make sure animation is playing
      charactersAreWalking = true;
    }

    scrollStopTimeoutId = setTimeout(() => {
      rachelSprite.textures = rachelAnimations.idle;
      rachelSprite.play(); // Make sure animation is playing
      benSprite.textures = benAnimations.idle;
      benSprite.play(); // Make sure animation is playing
      charactersAreWalking = false;
    }, 150);

    // Use requestAnimationFrame to ensure updates happen before the next repaint
    requestAnimationFrame(updateAnimation);
  });
})();
