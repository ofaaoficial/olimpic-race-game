
/*
*  Author: Oscar Felipe Guerrero Amado
*  21/02/2019
* */
const el = c => document.querySelector(c);
const on = (el, evnt, call) => el.addEventListener(evnt, call);
const randomNum = (max, min) => Math.round( Math.random() * (max - min) + min );

let animRunner, loop;

class Obstacle{
    constructor(x, runway){
        this.x = x;
        this.runway = runway;        
    }

    Draw(){
        el(`#runway${this.runway}`).innerHTML += `<span class="obstacle" style="left: ${this.x}px;" ></span>`;
    }

    ValidateCollapse(){
        if(
            RUNNER.x < this.x + 10
            &&
            RUNNER.x + 10 > this.x 
            &&
            RUNNER.jumping == false
            && 
            RUNNER.runway == this.runway
        ){
            GAME.start = false;
            el('#end').classList.remove('hide');
            el('#end .success').classList.add('hide');

            clearInterval(loop);  
            clearInterval(animRunner);   
        }
    }
}


const RUNNER = {
    el: el('#runner'),
    img: el('#runner img'),
    jumping: false,
    runway: 2,
    x: 0,
    y: 100,

    anim(){
        let d = 1;
        let sprite = 1;
        animRunner =  setInterval(()=>{
            this.img.src = `imgs/runner_${sprite}.png`;
            if(sprite == 3) d = -1;
            if(sprite == 1) d = 1;

            sprite += d;        
        } , 120);

        if(!GAME.start) clearInterval(animRunner);
    },
    jump(){                
        if(!this.jumping){     
            clearInterval(animRunner);            
            this.jumping = true;

            this.img.src = `imgs/runner_4.png`;

            el('#runner').animate([
                { transform: 'translateY(0px)' }, 
                { transform: 'translateY(-100px)' },
                { transform: 'translateY(0px)' }
            ],
            {   duration: 500,
                iterations: 1,                
            });

            setTimeout(()=>{ this.jumping = false; this.anim(); }, 500);
        }
    },
    changeRunway(move){
        RUNNER.img.style.transition = '.1s';
        if(move == 'up'){
            if(this.runway == 2)  {
                this.runway = 1;
                RUNNER.img.style.width = '60%';
                RUNNER.el.style.bottom = '120px';
                RUNNER.y = '120';
            }else if(this.runway == 3){  
                this.runway = 2; 
                RUNNER.img.style.width = '80%';
                RUNNER.el.style.bottom = '100px';
                RUNNER.y = '100';
            }
        }else if(move == 'down'){
            if(this.runway == 1)  {
                this.runway = 2;
                RUNNER.img.style.width = '80%';
                RUNNER.el.style.bottom = '100px';
                RUNNER.y = '100';
            }else if(this.runway == 2){
                this.runway = 3;
                RUNNER.img.style.width = '100%';
                RUNNER.el.style.bottom = '60px';
                RUNNER.y = '60';
            }
        }        
    }
}

const GAME = {    
    start: false,
    scroll: 0,
    obstacles: [
        new Obstacle(randomNum(500, 3300), 1),
        new Obstacle(randomNum(500, 3300), 2),
        new Obstacle(randomNum(500, 3300), 3),
        new Obstacle(randomNum(1000, 2000), randomNum(1,3)),
        new Obstacle(randomNum(1000, 2000), randomNum(1,3))
    ],
    startGame(){
        event.preventDefault();
        this.start = true;        

        RUNNER.anim();
        this.listener();                
        RUNNER.img.style.width = '80%';
        el('#start').style.display = 'none';

        for (const obstacle of this.obstacles) {
            obstacle.Draw();
        }

        for (let i = 1; i < 6; i++) {
            el(`#playground #panels .panel:nth-child(${i})`).style.animation = `visible 1s 1 ${i * 3}s ease-in-out forwards`;
        }

        window.requestAnimationFrame(this.loop.bind(this));
    
    },
    restart(){
        location.reload();
    },
    listener(){
        if(!RUNNER.jumping){
            on(document, 'keydown', (e)=>{                                
                switch(e.keyCode){
                    //space
                    case 32:
                        RUNNER.jump();
                    break;
                    //up
                    case 38:
                        if(!RUNNER.jumping) RUNNER.changeRunway('up'); 
                    break;
                    //down
                    case 40:
                        if(!RUNNER.jumping) RUNNER.changeRunway('down'); 
                    break;

                }                
            });            
        }
    },
    loop(){            
            RUNNER.el.style.left = `${RUNNER.x}px`;
            el('#game').style.left = `${GAME.scroll}px`;            
            if(GAME.scroll > -4000) { GAME.scroll-= 8; }

            if(RUNNER.x <= 5300) { 
                RUNNER.x+= 9;
            }else{
                //Finished
                clearInterval(animRunner);                
                el('#pyre img').src = `imgs/pyre_fire.svg`;
                el('#end').classList.remove('hide');
                el('#end .error').classList.add('hide');

                GAME.start = false;
            }
            
            if(RUNNER.x >= 4000) RUNNER.jumping = true; 

            if(RUNNER.x >= 4700 && RUNNER.x <= 4950){                                
                RUNNER.el.style.bottom = `${RUNNER.y}px`;
                RUNNER.y = parseInt(RUNNER.y) + 4;                
            }

            for (const obstacle of GAME.obstacles) {
                obstacle.ValidateCollapse();
            }
                        
            if(GAME.start) window.requestAnimationFrame(this.loop.bind(this));
    }
}