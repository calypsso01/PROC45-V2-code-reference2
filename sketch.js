var bg,bgImg,bgImg1;

var player, shooterImg, shooter_shooting;
var zombie, zombieImg1,zombieImg2,zombieImg3, zombieGroup;
var bats,batsImg;
var bulletGroup;

var life = 3;
var score = 0;
var bullets = 70;

var gameState = "fight"
var lose, winning, explosionSound, deadSound;


function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  bgImg = loadImage("assets/bg.jpeg")
  //bgImg1 = loadImage("assets/.jpeg");

  zombieImg1 = loadAnimation("assets/pvz_walk0.png","assets/pvz_walk1.png",
             "assets/pvz_walk2.png","assets/pvz_walk3.png","assets/pvz_walk5.png","assets/pvz_walk6.png");
  batsImg = loadAnimation("assets/bat1.png","assets/bat2.png","assets/bat3.png","assets/bat4.png",
             "assets/bat5.png","assets/bat6.png","assets/bat7.png","assets/bat8.png",
             "assets/bat9.png","assets/bat10.png","assets/bat11.png","assets/bat12.png");

  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

}

function setup() {
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
  bg.addImage(bgImg)
  bg.scale = 1;
  

//creating the player sprite
 player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   //player.debug = true
   player.setCollider("rectangle",0,0,300,300)

    //creando sprites para representar la vida sobrante
    heart1 = createSprite(displayWidth-150,40,20,20)
    heart1.visible = false
     heart1.addImage("heart1",heart1Img)
     heart1.scale = 0.2
 
     heart2 = createSprite(displayWidth-100,40,20,20)
     heart2.visible = false
     heart2.addImage("heart2",heart2Img)
     heart2.scale = 0.2
 
     heart3 = createSprite(displayWidth-150,40,20,20)
     heart3.addImage("heart3",heart3Img)
     heart3.scale = 0.2

      //creando un grupo para los zombis
    zombieGroup = new Group();
    bulletGroup = new Group();

}

function draw() {
  background(0); 

  if(gameState === "fight"){

    // Mostrar la imagen apropiada segun la vida restante 
    if(life===3){
      heart3.visible = true
      heart1.visible = false
      heart2.visible = false
    }
    if(life===2){
      heart2.visible = true
      heart1.visible = false
      heart3.visible = false
    }
    if(life===1){
      heart1.visible = true
      heart3.visible = false
      heart2.visible = false
    }
  
    // Ir al estado de juego (gameState) "lost" cuando quedan 0 vidas
    if(life===0){
      gameState = "lost"
      
    }
  
  
    // Ir al estado "won" si la puntuación es 100
    if(score==100){
      gameState = "won"
      winning.play();
    }  


  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}


//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
 
  bullet = createSprite(displayWidth-1150,player.y-30,20,10)
  bullet.velocityX = 20
  
  bulletGroup.add(bullet)
  player.depth = bullet.depth
  player.depth = player.depth+2
  player.addImage(shooter_shooting)
  bullets = bullets-1
  //explosionSound.play();
 
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

// Ir al estado de juego "bullet" cuando el jugador se queda sin balas
if(bullets==0){
  gameState = "bullet"
  //lose.play();
    
}

// Destruir al zombi cuando una bala lo toca e incrementar la puntuación
if(zombieGroup.isTouching(bulletGroup)){
  for(var i=0;i<zombieGroup.length;i++){     
      
   if(zombieGroup[i].isTouching(bulletGroup)){
        zombieGroup[i].destroy()
        bulletGroup.destroyEach()
        //explosionSound.play();
 
        score = score+2
        } 
  
  }
}

// Reducir la vida y destruir al zombi cuando el jugador lo toca
if(zombieGroup.isTouching(player)){
 
  //lose.play();
for(var i=0;i<zombieGroup.length;i++){     
     
 if(zombieGroup[i].isTouching(player)){
      zombieGroup[i].destroy()
     life=life-1
      } 

}
}

spawnZombies();
spawnBats();
}

drawSprites();

// Mostrar la puntuación, las vidas y balas restantes 
textSize(20)
fill("white")
text("Balas = " + bullets,displayWidth-200,displayHeight/2-250)
text("Puntuación = " + score,displayWidth-200,displayHeight/2-220)
text("Vidas = " + life,displayWidth-200,displayHeight/2-280)

// Destruir al zombi y al jugador y mostrar el mensaje en el estado de juego "lost"
if(gameState == "lost"){
  
  textSize(100)
  fill("red")
  text("Perdiste",displayWidth/2,displayHeight/2)
  zombieGroup.destroyEach();
  player.destroy();

}

// Destruir al zombi y al jugador y mostrar el mensaje del estado de juego "won"
else if(gameState == "won"){
 
  textSize(100)
  fill("yellow")
  text("Ganaste",displayWidth/2,displayHeight/2)
  zombieGroup.destroyEach();
  player.destroy();

}

// Destruir al zombi, jugador y balas y mostrar el mensaje en el estado de juego "bullet"
else if(gameState == "bullet"){
 
  textSize(50)
  fill("yellow")
  text("¡Te quedaste sin balas!",displayWidth/2,displayHeight/2)
  zombieGroup.destroyEach();
  player.destroy();
  bulletGroup.destroyEach();

}

}


function spawnZombies(){
  if(frameCount %60 === 0){
    zombie= createSprite(random(1000,1300),random(300,600),40,40);
    zombie.velocityX= -3;
    zombie.addAnimation("walking",zombieImg1);
    zombie.scale= 1.0;
    zombie.setCollider("rectangle",0,0,100,120);
    //zombie.debug = true;
    zombie.lifetime= 380;
  }
  
}

function spawnBats(){
  if(frameCount %70 === 0){
    bats= createSprite(random(1000,1300),random(50,200),40,40);
    bats.velocityX= -5;
    bats.addAnimation("flying",batsImg);
    bats.scale= 0.5;
    bats.setCollider("rectangle",0,0,100,80);
    //bats.debug = true;
    bats.lifetime= 380;
  }
  
}


 


