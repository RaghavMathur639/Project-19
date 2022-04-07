var PLAY = 1;
var END = 0;
var gameState = PLAY;

var pi, pi_running, pi_collided;
var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3;
var backgroundImg
var score = 0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadImage("backgroundImg.png")
  
  
  pi_running = loadAnimation("piImg.jpeg","pi2Img.jpeg","pi3Img.jpeg", "pi4Img.jpeg");
  pi_collided = loadAnimation("pi_collided.jpeg");
  
  groundImage = loadImage("groundImg.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  

  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  pi = createSprite(50,height-70,50,50);
  
  
  pi.addAnimation("running", pi_running);
  pi.addAnimation("collided", pi_collided);
  pi.setCollider('circle',0,0,150)
  pi.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
   invisibleGround.visible =false


  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  pi.debug = true;
  background(backgroundImg);
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/50);


    
    
    if((touches.length > 0 || keyDown("SPACE")) && pi.y  >= height-1200) {
      jumpSound.play( )
      pi.velocityY = -20;
       touches = [];
    }
    
    pi.velocityY = pi.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    pi.collide(invisibleGround);
    obstaclesGroup.collide(invisibleGround);
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(pi)){
        collidedSound.play()
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    pi.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
  
    
    //change the pikachu animation
    pi.changeAnimation("collided",pi_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
   
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}



function spawnObstacles() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(1500,height-95,20,30);
    obstacle.setCollider('circle',0,0,70)
     obstacle.debug = true
       
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1;
    obstacle.lifetime = 300;
    obstacle.depth = pi.depth;
    pi.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  
  pi.changeAnimation("running",pi_running);
  
  score = 0;
  
}
