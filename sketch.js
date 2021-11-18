const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;

var ground, rope, fruit, link, rabbit;
var cutButton, muteButton, airBlowerButton;

var bgImg, fruitImg, rabbitImg, rabbitBlink, rabbitEat, rabbitSad;
var airSound, eatSound, ropeCutSound, sadSound, bg_Sound;

var canvasWidth, canvasHeight;

function preload() {
  bgImg = loadImage("./assets/background.png");
  fruitImg = loadImage("./assets/melon.png");
  rabbitImg = loadImage("./assets/Rabbit-01.png");
  rabbitBlink = loadAnimation("./assets/blink_1.png", "./assets/blink_2.png", "./assets/blink_3.png");
  rabbitEat = loadAnimation("./assets/eat_0.png", "./assets/eat_1.png", "./assets/eat_2.png", "./assets/eat_3.png", "./assets/eat_4.png");
  rabbitSad = loadAnimation("./assets/sad_1.png", "./assets/sad_2.png", "./assets/sad_3.png");

  airSound = loadSound("./assets/air.wav");
  eatSound = loadSound("./assets/eating_sound.mp3");
  ropeCutSound = loadSound("./assets/rope_cut.mp3");
  sadSound = loadSound("./assets/sad.wav");
  bg_Sound = loadSound("./assets/sound1.mp3");

  rabbitBlink.playing = true;
  rabbitEat.playing = true;
  rabbitSad.playing = true;
  rabbitEat.looping = false;
  rabbitSad.looping = false;
}

function setup() {
  var isMobile = /iPhone|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    canvasWidth = displayWidth;
    canvasHeight = displayHeight;
    createCanvas(displayWidth + 80, displayHeight);
  } else {
    canvasWidth = windowWidth;
    canvasHeight = windowHeight;
    createCanvas(windowWidth, windowHeight);
  }

  rabbitBlink.frameDelay = 20;
  rabbitEat.frameDelay = 20;
  rabbitSad.frameDelay = 20;

  bg_Sound.play();
  //bg_Sound.setVolume(0.75);

  var fruitOptions = {
    density: 0.00012
  }

  engine = Engine.create();
  world = engine.world;

  ground = new Ground(width / 2, 690, width, 25);

  rope1 = new Rope(7, {x: canvasWidth / 2, y: 20});
  rope2 = new Rope(10, {x: 90, y: 20});
  rope3 = new Rope(5, {x: canvasWidth / 2 + 10, y: 145});

  fruit = Bodies.circle(300, 300, 30, fruitOptions);
  World.add(world, fruit);

  Matter.Composite.add(rope1.body, fruit);

  link1 = new Link(rope1, fruit);
  link2 = new Link(rope2, fruit);
  link3 = new Link(rope3, fruit);

  rabbit = createSprite(canvasWidth / 2, 600);
  rabbit.addAnimation("blink", rabbitBlink);
  rabbit.addAnimation("eat", rabbitEat);
  rabbit.addAnimation("sad", rabbitSad);
  rabbit.changeAnimation("blink");
  rabbit.scale = 0.25;

  cutButton1 = createImg("./assets/cut_btn.png");
  cutButton1.position(canvasWidth / 2 - 20, 20);
  cutButton1.size(50, 50);
  cutButton1.mouseClicked(drop1);

  cutButton2 = createImg("./assets/cut_btn.png");
  cutButton2.position(90, 20);
  cutButton2.size(50, 50);
  cutButton2.mouseClicked(drop2);

  cutButton3 = createImg("./assets/cut_btn.png");
  cutButton3.position(canvasWidth / 2 + 10, 145);
  cutButton3.size(50, 50);
  cutButton3.mouseClicked(drop3);

  muteButton = createImg("./assets/mute.png");
  muteButton.position(canvasWidth - 50, 50);
  muteButton.size(50, 50);
  muteButton.mouseClicked(mute);

  airBlowerButton = createImg("./assets/balloon.png");
  airBlowerButton.position(10, 250);
  airBlowerButton.size(150, 100);
  airBlowerButton.mouseClicked(airBlow);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
}

function draw() {
  background(51);
  image(bgImg, 0, 0, canvasWidth, canvasHeight);

  Engine.update(engine);

  ground.display();
  rope1.show();
  rope2.show();
  rope3.show();

  push();
  imageMode(CENTER);
  if (fruit != null) {
    image(fruitImg, fruit.position.x, fruit.position.y, 70, 70);
  }
  pop();

  if (collide(fruit, rabbit) == true) {
    rabbit.changeAnimation("eat");
    eatSound.play();
  }

  if (fruit != null && fruit.position.y >= 650) {
    rabbit.changeAnimation("sad");
    bg_Sound.stop();
    sadSound.play();
    //sadSound.setVolume(0.1);
  }

  drawSprites();
}

function drop1() {
  rope1.break();
  link1.detach();
  link1 = null;
  ropeCutSound.play();
}

function drop2() {
  rope2.break();
  link2.detach();
  link2 = null;
  ropeCutSound.play();
}

function drop3() {
  rope3.break();
  link3.detach();
  link3 = null;
  ropeCutSound.play();
}

function collide(body, sprite) {
  if (body != null) {
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d <= 80) {
      World.remove(world, fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
}

function mute() {
  if (bg_Sound.isPlaying()) {
    bg_Sound.stop();
  } else {
    bg_Sound.play();
  }
}

function airBlow() {
  Matter.Body.applyForce(fruit, {
    x: 0,
    y: 0
  }, {
    x: 0.01,
    y: 0
  });
  airSound.play();
}