let canvas = document.querySelector(".canvas");
let ctx = canvas.getContext("2d");
canvas.width = 2*window.innerWidth;
canvas.height = 2*window.innerHeight;
canvas.style.transform = "scale(0.5)"

window.addEventListener("resize", function() {
	canvas.width = document.body.clientWidth*2;
	canvas.height = document.body.clientHeight*2;
});

let particles = [];

let cursor = {
    down: false,
    x: null,
    y: null
}

function newParticle({ x = 0, y = 0, size = optionsMenu.particlesSize, hue = Math.random()*359 } = {}) {
    let time = (new Date()).getTime();
    let n = Math.floor(Math.random()*3);
    let particle = {
        x,
        y,
        hue,
        size,
        distance: Infinity,
        direction: Math.floor(Math.random()*(360/optionsMenu.angle))*optionsMenu.angle,
        lastTimeDrawn: time,
        created: time,
        delete: function() {
            if (particles.length<optionsMenu.maxParticles) {
                particles.push(newParticle({x: particle.x, y: particle.y, r: particle.r, g: particle.g, b: particle.b}));
                if (Math.random()>0.9) particles.push(newParticle({x: particle.x, y: particle.y, r: particle.r, g: particle.g, b: particle.b}));
            }
            particles.splice(particles.indexOf(particle), 1);
        },
        draw: function(t) {
            let diff = t - particle.lastTimeDrawn;
            particle.lastTimeDrawn = t;
            particle.distance = cursor.x == null ? Infinity : Math.sqrt((cursor.x-particle.x)**2+(cursor.y-particle.y)**2);
            if (Math.random()<optionsMenu.particlesChangeDirectionRate) {
                if (particle.distance>=optionsMenu.minDistance) {
                    particle.direction = (particle.direction + 360 + (Math.random()>0.5 ? optionsMenu.angle : -optionsMenu.angle))%360;
                }
                else {
                    particle.direction = (particle.direction + 360 + (Math.random()<probabilityForPositiveTurn(particle) ? optionsMenu.angle : -optionsMenu.angle))%360;
                }
            } 
            particle.x += diff*optionsMenu.particlesSpeed*Math.cos(Math.PI*particle.direction/180)
            particle.y -= diff*optionsMenu.particlesSpeed*Math.sin(Math.PI*particle.direction/180)
            if (optionsMenu.border == "portal") {
                if (particle.x<-canvas.width/2) particle.x += canvas.width;
                if (particle.y<-canvas.height/2) particle.y += canvas.height;
                if (particle.x>canvas.width/2) particle.x -= canvas.width;
                if (particle.y>canvas.height/2) particle.y -= canvas.height;
            }
            if (optionsMenu.border == "border") {
                if (particle.x<-canvas.width/2) particle.x = -canvas.width/2;
                if (particle.y<-canvas.height/2) particle.y = -canvas.height/2;
                if (particle.x>canvas.width/2) particle.x = canvas.width/2;
                if (particle.y>canvas.height/2) particle.y = canvas.height/2;
            }
            ctx.fillStyle = `hsl(${particle.hue},100%,50%)`;
            ctx.beginPath();
            ctx.arc(particle.x-optionsMenu.particlesSize/2+canvas.width/2, particle.y-optionsMenu.particlesSize/2+canvas.height/2, optionsMenu.particlesSize, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
        },
    };
    return particle;
}

function draw() {
    ctx.fillStyle = `rgba(0,0,0,${optionsMenu.afterimage})`
    ctx.fillRect(0,0,canvas.width,canvas.height);
    let time = (new Date()).getTime()
    particles.forEach(function(el){
        el.draw(time);
        if (el.created + optionsMenu.particleLifespan < time) el.delete();
    });
    window.requestAnimationFrame(draw);
}

function probabilityForPositiveTurn({ x, y, direction }) {
    let desiredAngle = ((Math.atan2(-(cursor.y - y), cursor.x - x)/Math.PI)*180+360)%360;
    if (diffAngle(desiredAngle, direction + optionsMenu.angle)<diffAngle(desiredAngle, direction - optionsMenu.angle)) return optionsMenu.positiveTurnChangeRate;
    return 1-optionsMenu.positiveTurnChangeRate;
}

function diffAngle(a1, a2) {
    a1 = (a1 + 720)%360;
    a2 = (a2 + 720)%360;
    return Math.min(360-Math.abs(a1-a2), Math.abs(a1-a2))
}

document.addEventListener("mousedown", function(e){
    cursor.down = true;
});

document.addEventListener("mouseup", function(){
    cursor.down = false;
});

document.addEventListener("mousemove", function(e){
    cursor.x = e.clientX*2-canvas.width/2;
    cursor.y = e.clientY*2-canvas.height/2;
});

window.requestAnimationFrame(draw);

for (let i=0; i<300; i++) {
    particles.push(newParticle())
}