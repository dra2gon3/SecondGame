"use strict";

var canvas = null;
var context = null;

function Box(color, x, y){
    this.color = color;
    this.x = x;
    this.y = y;
    this.alive = true;
}
var boxes = [];
var paddle_x = 0;
var paddle_velocity = 0;
var ball_x = 400, ball_y = 400;
var ball_vx = -3, ball_vy = -5;

function init(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
     
    var colors = ["red","yellow","green","blue"];
    for( var i = 0; i < colors.length; ++i){
        for ( var x = 0; x < 10; ++x){
            boxes.push(new Box(colors[i], x * (canvas.width / 10), i * (canvas.height / 20)));
        }
    }
    paddle_x = canvas.width/2;
}
function drawBox(color, x, y){
    context.fillStyle = color;
    context.fillRect(x,y,canvas.width/10, canvas.height / 20);
    context.strokeStyle = "black";
    context.strokeRect(x,y,canvas.width/10, canvas.height / 20);
}
function drawPaddle(x){
    context.fillStyle = "orange";
    context.fillRect(x, canvas.height - 50, canvas.width / 10, canvas.height / 40);
}
function drawBall(x,y){
    context.fillStyle = "white";
    context.beginPath();
    context.arc( x, y, 10, 0, 360);
    context.closePath();
    context.fill();
}
function draw(){
    context.fillStyle = "cornflowerblue";
    context.fillRect(0 , 0 , 800 , 600);
    
    for( var i = 0; i < boxes.length; ++i){
        if(!boxes[i].alive) continue;
        drawBox(boxes[i].color, boxes[i].x, boxes[i].y);
    }
    drawPaddle(paddle_x);
    drawBall(ball_x, ball_y);
}
function overlap(x1,y1,w1,h1,x2,y2,w2,h2){
    var x_hit = (x1 < x2 && x1 + w1 > x2) || (x2 < x1 && x2 + w2 > x1)
    var y_hit = (y1 < y2 && y1 + h1 > y2) || (y2 < y1 && y2 + h2 > y1)
    return x_hit && y_hit;
}
function update(){
    paddle_x += paddle_velocity;
    if(paddle_x < 0) paddle_x = 0;
    if(paddle_x > canvas.width - 80) paddle_x = canvas.width - 80;
    
    ball_x += ball_vx;
    ball_y += ball_vy;
    
    if(ball_x < 0){
        ball_vx = -ball_vx;
        ball_x = 0;
    }
    if(ball_x > canvas.width){
        ball_vx = -ball_vx;
        ball_x = canvas.width;
    }
    if(ball_y < 0){
        ball_vy = -ball_vy;
        ball_y = 0;
    }
    if(ball_y > canvas.height){
        ball_x = 400;
        ball_y=400;
        ball_vx = 3;
        ball_vy = -5;
        boxes = [];
        init();
    }
    for(var i = 0; i < boxes.length; ++i){ 
        if(!boxes[i].alive) continue;
        if(overlap(ball_x - 5, ball_y - 5, 10, 10, boxes[i].x, boxes[i].y, canvas.width /10, canvas.width/20)){
           ball_vy = -ball_vy;
           boxes[i].alive = false;
           break;
           }
    }
    if(overlap(ball_x-5, ball_y -5, 10, 10,paddle_x, canvas.height-50, canvas.width/10,canvas.height/40)){
        ball_vy = -ball_vy;
    }
    draw();
}
function handleKeyDown(){
    if(event.keyCode === 37){
        paddle_velocity = -10;
    }
    else if(event.keyCode === 39){
        paddle_velocity = 10;
    }
    //update();
}
function handleKeyUp(){
    if(event.keyCode === 37 && paddle_velocity < 0){
        paddle_velocity = 0;
    }
    else if(event.keyCode === 39 && paddle_velocity > 0){
        paddle_velocity = 0;
    }
}

window.onload = function() { init(); draw(); }
window.onkeydown = function() { handleKeyDown(); };
window.onkeyup = function() { handleKeyUp(); };
window.setInterval(update, 16);












