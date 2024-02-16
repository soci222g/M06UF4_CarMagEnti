
let player_num = 0;
let player1;
let player2;



const socket = new WebSocket("ws://10.40.1.50:8080");

socket.addEventListener("open", function(event){
});

socket.addEventListener("message",function(event){
    console.log("Server: ", event.data);

    let data = JSON.parse(event.data);

    if(data.player_num != undefined){
        player_num = data.player_num;
        console.log("Jugador numero: ", player_num);
    }
    else if (data.x != undefined){
        if(player_num == 1){
            player2.x = data.x;
            player2.y = data.y;
            player2.rotation = data.r;
            
            bullet2.x = data.bx;
            bullet2.y = data.by;
            bullet2.rotation = data.br;
        }
        if(player_num == 2){
            player1.x = data.x;
            player1.y = data.y;
            player1.rotation = data.r;

            bullet1.x = data.bx;
            bullet1.y = data.by;
            bullet1.rotation = data.br;
        }
        
    }
});




  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene:{
        preload: preload,
        create: create,
        update: update
    }
    
}

const game = new Phaser.Game(config);


//Variables

let player1_angle = 0;

let player2_angle = 0;


let bullet1;
let bullet1_angle = 0;
let bullet1_Spawned = false;


let bullet2;
let bullet2_angle = 0;
let bullet2_spawned = false;


let bullet_speed = 5;

let player_speed = 3;
let player_rotation_speed = 2;

let bg;


let player1_collided;
let player2_collided;


function preload(){
    this.load.image("Player1-img", "assets/PNG/Cars/car_red_small_1.png");
    this.load.image("Player2-img","assets/PNG/Cars/car_blue_small_1.png");
    this.load.image("bg-img","background.png");
    this.load.image("bullet-img", "bullet.png");
}

function create(){
    bg = this.add.image(config.width/2, config.height/2, "bg-img");

   
    player1 = this.add.image(config.width/3, config.height/2,"Player1-img");
    player2 = this.add.image((config.width/3) * 2,config.height/2,"Player2-img");
    console.log("genera Ballas");

    bullet1 = this.add.image(config.width/2, config.height/2,"bullet-img");
    bullet2 = this.add.image(config.width/2, config.height/2,"bullet-img");

    //KEYS
    cursors = this.input.keyboard.createCursorKeys();
}

function update(){






    bullet1.y -= bullet_speed*Math.cos(bullet1_angle*Math.PI/180);
    bullet1.x += bullet_speed*Math.sin(bullet1_angle*Math.PI/180);

    bullet2.y -= bullet_speed*Math.cos(bullet2_angle*Math.PI/180);
    bullet2.x += bullet_speed*Math.sin(bullet2_angle*Math.PI/180);


    if(player_num == 0){
        return;
    }
    else if(player_num == 1){
        if(cursors.left.isDown){
            player1_angle -=  player_rotation_speed;
        }
        else if (cursors.right.isDown){
            player1_angle +=  player_rotation_speed;
        
        }
    player1.rotation = player1_angle*Math.PI/180;
        if(cursors.up.isDown){
            player1.y -= player_speed*Math.cos(player1_angle*Math.PI/180);
            player1.x += player_speed*Math.sin(player1_angle*Math.PI/180);
        }

        if(cursors.space.isDown && !bullet1_Spawned){

            bullet1.x = player1.x;
            bullet1.y = player1.y - player1.height/2;
            bullet1.rotation = player1_angle*Math.PI/180;
            bullet1_angle = player1_angle;
            bullet1_Spawned = true;
        }
/*
        if(bullet2.x == player1.x && bullet2.y == player1.y){
            player1_collided = true;
        }
    */
   
         var player_data = {
            x: player1.x,
            y: player1.y,
            r: player1.rotation,


            bx: bullet1.x,
            by: bullet1.y,
            br: bullet1.rotation
     
        };

        socket.send(JSON.stringify(player_data));
    }
    

    else if(player_num == 2){
        if(cursors.left.isDown){
            player2_angle -=  player_rotation_speed;
        }
        else if (cursors.right.isDown){
            player2_angle +=  player_rotation_speed;
        
        }

        if(cursors.up.isDown){
            player2.y -= player_speed*Math.cos(player2_angle*Math.PI/180);
            player2.x += player_speed*Math.sin(player2_angle*Math.PI/180);
        }
        player2.rotation = player2_angle*Math.PI/180;
    

        if(cursors.space.isDown && !bullet2_spawned){

            bullet2.x = player2.x;
            bullet2.y = player2.y - player2.height/2;
            bullet2.rotation = player2_angle*Math.PI/180;
            bullet2_angle = player2_angle;
            bullet2_spawned = true;
        }
/*
        if(bullet1.x == player2.x && bullet1.y == player2.y){
            player2_collided = true;
        }
  */  
   
        var player_data = {
            x: player2.x,
            y: player2.y,
            r: player2.rotation,


            bx: bullet2.x,
            by: bullet2.y,
            br: bullet2.rotation

        };


        socket.send(JSON.stringify(player_data));


    }
}

