let c = document.createElement("canvas");
let container = document.getElementById('container');
let ctx = c.getContext("2d");
c.width = 1500;
c.height = 1000;
container.appendChild(c);

let perm = [];
while (perm.length < 1000) {
    while (perm.includes(val = Math.floor(Math.random() * 1000)));
    perm.push(val);
}

let lerp = (a, b, t) => a + (b - a) * (1-Math.cos(t*Math.PI))/2;
let noise = x => {
    x = x * 0.01;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}



let player = new function () {

    this.x = c.width / 2;
    this.y = 0;
    this.ySpeed = 0;
    this.rot = 0;
    this.img = new Image();
    this.img.src = "moto.png";
    this.rSpeed = 0;


    this.arc = 26;
    this.draw = function () {
        if (this.ySpeed > 6) this.ySpeed = 6;
        if (this.rSpeed > 3) this.rSpeed = 3;
        let p1 = c.height - noise(t + this.x) * 0.25;
        let p2 = c.height - noise(t + 5 + this.x) * 0.25;
        let grounded = 0;
        if (p1-this.arc > this.y) {
            this.ySpeed += 0.1;
        } else {
            this.ySpeed -= this.y - (p1-this.arc);
            this.y = p1 - this.arc;
            grounded = 1;
        }

        if (!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5) {
            playing = false;
            this.rSpeed = 5;
            k.ArrowUp = 1;
            this.x -= speed * 2.5;
        
        }


        let angle = Math.atan2((p2 - this.arc) - this.y, (this.x + 5) - this.x);
        this.y += this.ySpeed;



        if (grounded && playing) {
            this.rot -= (this.rot - angle) ;
            this.rSpeed = this.rSpeed - (angle-this.rot);

        }
        if (this.rSpeed > 0.5) this.rSpeed = 0.5;
        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.01;
        this.rot -= this.rSpeed * 0.1;
        
        if (this.rot > Math.PI) this.rot = -Math.PI;
        if (this.rot < -Math.PI) this.rot = Math.PI;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.img, -30,-30, 60, 60);
        ctx.restore();

    }


}


let t = 0;
let speed = 0;
let k = { ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0 };
let playing = true;
let score = 0;
function loop() {
    if (speed === 0 && k.ArrowDown === 1) k.ArrowDown = 0;
    if (playing) {
    score += speed*0.1;
    } 
    if (speed > 3) speed = 3;
    speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.005;
    if (speed < 0) speed = 0;
    t += 5*speed;
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(0, c.height);
    for (let i = 0; i < c.width;  i++){
        ctx.lineTo(i, c.height- noise(t+i)*0.25);
    }
    ctx.lineTo(c.width, c.height);
    ctx.fill();

    player.draw();
    ctx.font = '30px cursive';
    ctx.fillStyle = 'black';
    ctx.fillText("score", c.width - 100, 50);
    ctx.fillText(Math.floor(score), c.width - 100, 90);
    if (!playing) {
            ctx.font = '30px cursive';
        ctx.fillStyle = 'black';
        ctx.fillText("new score: "+Math.floor(score), c.width / 2, c.height / 2-80);
        ctx.fillText("new game?", c.width / 2, c.height / 2);
        ctx.fillText("press spacebar", c.width / 2, c.height / 2+30);
    }

    requestAnimationFrame(loop);
}


// onkeydown = d => k[d.key] =1;
    onkeydown = d => {
        k[d.key] =1;
        if (d.code === "Space" && !playing) {
            playing = true;
            score = 0;
            player.x = c.width / 2;
            player.y = c.height / 2;
            player.speed = 0;
            player.rSpeed = 0;
            player.rot = 0;
            k.ArrowUp = 0;
            k.ArrowDown = 1;
            t = 0;
            perm = [];
            while (perm.length < 1000) {
    while (perm.includes(val = Math.floor(Math.random() * 1000)));
    perm.push(val);
}

        } 
    }
onkeyup = d => k[d.key] =0;

loop();
