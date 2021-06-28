var PLAY = 1;
var END = 0;
var GameState = PLAY;


var jumpSound, checkPoint, Die;
var trex, trexIsrunning, trexCollided
var ground, InvisibleGround, groundImage
var cloudImage, cloudsGroup, clouds
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var GAME_overImg, RestartImg;

var score;

function preload() {
  trexIsrunning = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollided = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  GAME_overImg = loadImage("unnamed.png");
  RestartImg = loadImage("Re.png")

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  die = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  checkPoint = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(600, 200);
  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trexIsrunning);
  trex.addAnimation("collided", trexCollided)
  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  GAmeOver = createSprite(300, 100);
  GAmeOver.addImage(GAME_overImg);
  
  Restart = createSprite(300, 150);
  Restart.addImage(RestartImg);
  
  GAmeOver.scale = 0.5;
  Restart.scale = 0.2;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
trex.setCollider("circle", 0,0,40);
  ///trex.debug = true;

  score = 0;

}

function draw() {
  background("white");
  fill("black")
  textSize(18 )
  text("Score: " + score, 500, 50);

  if (GameState === PLAY) {
    ground.velocityX = -(4 + 1   * score/100);
    score = score + Math.round(frameCount / 60);
    GAmeOver.visible = false;
    Restart.visible = false;
    
    trex.changeAnimation("running", trexIsrunning);
    
    if(score>0 && score%1000 === 0) {
      checkPoint.play();
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if (keyDown("space") && trex.y >= 120) {
      trex.velocityY = -10;
      jumpSound.play()
    }
    trex.velocityY = trex.velocityY + 0.8;

    spawnObstacles();
    spawnClouds();

    if (obstaclesGroup.isTouching(trex)) {
      GameState = END;
      die.play();
    }

  } else if (GameState === END) {
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    if(mousePressedOver(Restart)) {
      reset();
    }
                     
trex.velocityY = 0;
    
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
GAmeOver.visible = true;
    Restart.visible = true;

trex.changeAnimation("collided", trexCollided);
  }

  trex.collide(invisibleGround);
  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(400, 165, 10, 40);
    obstacle.velocityX = -6;

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.y = Math.round(random(10, 60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 205;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset() {
  GameState = PLAY;
  GAmeOver.visble = false;
  Restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trexIsrunning);
  score = 0;
   ground.velocityX = -(4 + 2* score/100)
}