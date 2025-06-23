import {
  Application,
  Assets,
  Sprite,
  Spritesheet,
  TilingSprite,
  Point,
  SCALE_MODES,
  Graphics,
  Container,
  Text,
} from "pixi.js";
import {
  getScaledBackgroundSprite,
  getScaledSprite,
  getScaledAnimatedSprite,
  loadBackground,
  loadCharacters,
  setScaleRelativeToViewHeightOrMaxWidth,
} from "./assets.js";
import { ParallaxSprite, ParallaxScene } from "./parallax.js";
import { initDevtools } from "@pixi/devtools";

const POST_WIDTH = 400;
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

  // Append the application canvas to the document body
  container.appendChild(app.canvas);

  // Load textures
  const rachel_idle_texture = await loadCharacters("/assets/rachel_idle.json");
  const rachel_walk_texture = await loadCharacters("/assets/rachel_walk.json");
  const ben_idle_texture = await loadCharacters("/assets/ben_idle.json");
  const ben_walk_texture = await loadCharacters("/assets/ben_walk.json");
  const sheet = await loadBackground();
  const formal1 = await Assets.load("/assets/formal1.JPG");
  const camp2 = new Sprite(await Assets.load("/assets/camp2.JPG"));
  const bus3 = new Sprite(await Assets.load("/assets/bus3.JPG"));
  const grad4 = new Sprite(await Assets.load("/assets/grad4.JPG"));
  const grad5 = new Sprite(await Assets.load("/assets/grad5.JPG"));
  const park6 = new Sprite(await Assets.load("/assets/park6.JPG"));
  const hayes7 = new Sprite(await Assets.load("/assets/hayes7.JPG"));
  const hayesformal8 = new Sprite(
    await Assets.load("/assets/hayesformal8.JPG"),
  );
  const mattress9 = new Sprite(await Assets.load("/assets/mattress9.JPG"));
  const pergola10 = new Sprite(await Assets.load("/assets/pergola10.JPG"));
  const proposal11 = new Sprite(await Assets.load("/assets/proposal11.JPG"));
  const goodbye11 = new Sprite(await Assets.load("/assets/goodbye11.JPG"));
  const europe = new Sprite(await Assets.load("/assets/europe.JPG"));
  const chicago_texture = await Assets.load("/assets/chicago.png");
  const paintedLadiesTexture = await Assets.load("/assets/paintedladies.png");
  const deering_texture = await Assets.load("/assets/deering.png");
  const weber_texture = await Assets.load("/assets/weber.png");
  const hayesHouseTexture = await Assets.load("/assets/958.png");
  const eiffelSheet = await Assets.load("/assets/eiffel.json");
  // Set scale mode to nearest to ensure sharp pixels.
  eiffelSheet.textures["eiffel (Flattened).aseprite"].baseTexture.scaleMode =
    SCALE_MODES.NEAREST;
  eiffelSheet.textures["eiffel (tower).aseprite"].baseTexture.scaleMode =
    SCALE_MODES.NEAREST;
  chicago_texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
  deering_texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
  weber_texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
  paintedLadiesTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
  hayesHouseTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST;

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
  const formal1Sprite = new Sprite(formal1);
  const imgSprites = [
    [formal1Sprite, "2017: Ben and Rachel meet at Northwestern (RIP La Mach)."],
    [
      camp2,
      "They go on a few adventures (including Ben’s first camping trip).",
    ],
    [bus3, "They share a lot of laughs and made a lot of good memz."],
    [grad4, "In 2019, Ben graduates and moves to San Francsico."],
    [
      grad5,
      "2020: Rachel graduates and “temporarily” moves to SF because of COVID.",
    ],
    [park6, "Lots of good park hangs during the Pandemic."],
    [
      hayes7,
      "2021: Ben and Rachel moves into the Hayes House with 7 other friends. Chaos and lifelong friendships ensue. ",
    ],
    [
      europe,
      "2022: The couple travel through Europe for 3 months, London, Paris, Barcelona.",
    ],
    [hayesformal8, "The Era of Hayes House comes to a close."],
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
      "We’re so excited to celebrate with you all at Sato Somer Camp <3",
    ],
  ];

  const chicago = getScaledSprite(chicago_texture, app);
  const paintedLadies = getScaledSprite(paintedLadiesTexture, app);
  const weber = getScaledSprite(weber_texture, app);
  const deering = getScaledSprite(deering_texture, app);
  const hayesHouse = getScaledSprite(hayesHouseTexture, app);
  const tower = getScaledSprite(
    eiffelSheet.textures["eiffel (tower).aseprite"],
    app,
  );
  const eiffelBushes = getScaledSprite(
    eiffelSheet.textures["eiffel (Flattened).aseprite"],
    app,
  );
  const foreground = getScaledBackgroundSprite(
    sheet.textures["grassy (Grass).aseprite"],
    app,
  );
  const sky = getScaledBackgroundSprite(
    sheet.textures["grassy (Sky).aseprite"],
    app,
  );

  // Layout
  // how far along x you have to be to be roughly in the right of the frame after the initial scrolling.
  // At least for images..
  // Screen size dependent.
  const INITIAL_SCROLL_OFFSET = app.screen.height * 2;
  // FOREGROUND_LAYER_FACTOR is also the "world" base parallax scroll. Really it's not a parallax factor, but a ratio of how many vertical pixels should translate to horizontal scrolls.
  const FOREGROUND_LAYER_FACTOR = 0.3;
  const CHICAGO_LAYER_FACTOR = 0.2;
  const SPECIFIC_BUILDING_LAYER_FACTOR = 0.23;
  const IMAGE_LAYER_FACTOR = 0.25;
  const SKY_LAYER_FACTOR = 0.02;

  // Set initial positions
  foreground.y = 30;
  chicago.y = -90;
  chicago.x = INITIAL_SCROLL_OFFSET + 500;
  paintedLadies.y = -100;
  paintedLadies.x = INITIAL_SCROLL_OFFSET + 3000;
  weber.x = INITIAL_SCROLL_OFFSET;
  weber.y = app.screen.height * 0.45;
  deering.x = INITIAL_SCROLL_OFFSET + 200;
  deering.y = app.screen.height * 0.35;
  tower.y = -100;
  eiffelBushes.y = -110;
  tower.x = INITIAL_SCROLL_OFFSET + 5200;
  eiffelBushes.x =
    INITIAL_SCROLL_OFFSET + 5200 + (INITIAL_SCROLL_OFFSET + 5200) * 0.02 + 550;
  hayesHouse.x = INITIAL_SCROLL_OFFSET + 6400;
  hayesHouse.y = app.screen.height * 0.19;

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

  const imgParallaxSprites = imgSprites.map((spriteAndLabel, index) => {
    let sprite = spriteAndLabel[0];
    let label = spriteAndLabel[1];
    sprite.anchor.set(0.5);
    // Split based on vert or horizontal photos.
    let scale = null;
    scale = setScaleRelativeToViewHeightOrMaxWidth(0.4, sprite, app);
    sprite.x = (index + 1) * 900 + INITIAL_SCROLL_OFFSET;
    sprite.y = app.screen.height / 2.7;

    const parallaxSprite = new ParallaxSprite(sprite, IMAGE_LAYER_FACTOR);
    parallaxContainer.addParallaxChild(parallaxSprite);
    addSignpost(sprite, label, scale);
    return parallaxSprite;
  });

  // Character Positions
  const CHARACTER_ANIMATION_SPEED = 0.2;
  rachelSprite.anchor.set(0, 1);
  rachelSprite.y = app.screen.height * 0.97;
  rachelSprite.x = app.screen.width * 0.1;
  rachelSprite.animationSpeed = CHARACTER_ANIMATION_SPEED;
  rachelSprite.play();

  benSprite.anchor.set(0, 1);
  benSprite.y = app.screen.height * 0.95;
  benSprite.x = app.screen.width * 0.15;
  benSprite.animationSpeed = CHARACTER_ANIMATION_SPEED - 0.05;
  benSprite.play();

  // Staging
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
  function handleResize() {
    // Update TilingSprite dimensions to fill the new logical screen size.
    foreground.width = app.screen.width;
    foreground.height = app.screen.height;
    sky.width = app.screen.width;
    sky.height = app.screen.height;

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

  let currentScrollY = 0;
  let animationScrollY =
    currentScrollY - preambleHeight > 0 ? currentScrollY - preambleHeight : 0;
  let scrollFraction = 0;
  let deltaY = 0;
  let scrollStopTimeoutId = null;
  let charactersAreWalking = false;
  // Force the layout and move everything into place.
  requestAnimationFrame(updateAnimation);

  function updateAnimation() {
    // Calculate scroll progress (0 to 1)
    deltaY = window.scrollY - currentScrollY;
    currentScrollY = window.scrollY;
    animationScrollY =
      currentScrollY - preambleHeight > 0 ? currentScrollY - preambleHeight : 0;
    scrollFraction =
      animationScrollY > 0 ? animationScrollY / animationScrollLength : 0;

    // If Ben has reached the last image, zero out any positive deltaYs.
    console.log("ben: " + benSprite.getGlobalPosition().x);
    console.log(
      "last: " + imgParallaxSprites.slice(-1)[0].getGlobalPosition().x,
    );
    // We must use global positions to compare.
    // if (
    //   benSprite.getGlobalPosition().x >=
    //   imgParallaxSprites.slice(-1)[0].getGlobalPosition().x
    // ) {
    //   if (deltaY > 0) {
    //     deltaY = 0;
    //   }
    // }
    // Update character position/animation based on scroll progress (basic example)
    // For a walk cycle, you would change sprite frames here
    // character.y = (app.screen.height / 2 - character.height / 2) + (scrollProgress * 50); // Example: move character down slightly
    foreground.tilePosition.x -= deltaY * FOREGROUND_LAYER_FACTOR;
    sky.tilePosition.x -= deltaY * SKY_LAYER_FACTOR;
    // formal1Sprite.x -= deltaY * IMAGE_LAYER_FACTOR;
    parallaxContainer.moveX(-deltaY);
    //chicago.x -= deltaY * IMAGE_LAYER_FACTOR;
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
