const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let circleMovementRadius = 0;
let isMouseMove = false;
let hasTrail = true;
let ischangingColor = true;

var gui = new dat.GUI();
const startXrange = { startXrange: 0 };
gui.add(startXrange, "startXrange", 0, 100);
const startYrange = { startYrange: 0 };
gui.add(startYrange, "startYrange", 0, 100);
const particleNumber = { particleNumber: 50 };
gui.add(particleNumber, "particleNumber", 3, 60);
const speed = { speed: 3 };
gui.add(speed, "speed", 2, 5);
const particleSize = { particleSize: 5 };
gui.add(particleSize, "particleSize", 1, 10);
const interval = { interval: 200 };
gui.add(interval, "interval", 200, 1000);
const trailParameters = {
  trail: true,
};
const trail = gui
  .add(trailParameters, "trail")
  .name("trail")
  .listen()
  .onChange(function () {
    hasTrail = !hasTrail;
  });

const colorParameters = { color: "#187cdb" };

const updateColor = () => {
  console.log(colorParameters.color);
};

gui.addColor(colorParameters, "color").onChange(updateColor);

const changeColorParameters = {
  changeColor: true,
};
const changeColor = gui
  .add(changeColorParameters, "changeColor")
  .name("changeColor")
  .listen()
  .onChange(function () {
    ischangingColor = !ischangingColor;
  });
const movementParameters = {
  nothing: true,
  mouseMove: false,
  circles: false,
};

var movement = gui.addFolder("Movement");
var pos1 = movement
  .add(movementParameters, "nothing")
  .name("Nothing")
  .listen()
  .onChange(function () {
    setChecked("nothing");
  });
var neg1 = movement
  .add(movementParameters, "mouseMove")
  .name("MouseMove")
  .listen()
  .onChange(function () {
    setChecked("mouseMove");
  });
var neu1 = movement
  .add(movementParameters, "circles")
  .name("Circles")
  .listen()
  .onChange(function () {
    setChecked("circles");
  });

function setChecked(prop) {
  for (let param in movementParameters) {
    movementParameters[param] = false;
  }
  movementParameters[prop] = true;
  console.log(prop);
  if (prop === "mouseMove") {
    circleMovementRadius = 0;
    isMouseMove = true;
  } else if (prop === "circles") {
    circleMovementRadius = 100;
    isMouseMove = false;
  } else {
    circleMovementRadius = 0;
    isMouseMove = false;
  }
}

const mouse = {
  x: 0,
  y: 0,
};

let time = 0;
let hue = 0;
let realHue = 0;
class Particle {
  constructor(x, y, color, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = velocity;
    this.ttl = 1000;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, particleSize.particleSize, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.ttl--;
    this.x += this.velocity.x * speed.speed;
    this.y += this.velocity.y * speed.speed;
  }
}

const particles = [];

const generateParticles = () => {
  const rad = (Math.PI * 2) / particleNumber.particleNumber;

  realHue = Math.sin(hue);
  for (let i = 0; i < particleNumber.particleNumber; i++) {
    let x;
    let y;
    if (isMouseMove) {
      x = mouse.x + Math.cos(rad * i) * startXrange.startXrange;
      y = mouse.y + Math.sin(rad * i) * startYrange.startYrange;
    } else {
      x =
        canvas.width / 2 +
        Math.cos(time * Math.PI * 2) * circleMovementRadius +
        Math.cos(rad * i) * startXrange.startXrange;
      y =
        canvas.height / 2 +
        Math.sin(time * Math.PI * 2) * circleMovementRadius +
        Math.sin(rad * i) * startYrange.startYrange;
    }
    const color = ischangingColor
      ? `hsl(${Math.abs(realHue * 360)}, 50%, 50%)`
      : colorParameters.color;
    particles.push(
      new Particle(x, y, color, {
        x: Math.cos(rad * i),
        y: Math.sin(rad * i),
      })
    );
  }
  hue += 0.05;
  setTimeout(generateParticles, interval.interval);
};

generateParticles();

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const animate = () => {
  time += 0.002;
  ctx.beginPath();
  ctx.rect(0, 0, window.innerWidth, window.innerHeight);
  const opacity = hasTrail ? 0.2 : 1;
  ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
  ctx.fill();
  particles.forEach((particle, index) => {
    if (particle.ttl < 0) {
      setTimeout(() => {
        particles.splice(index, 1);
      });
    } else {
      particle.update();
    }
  });
  requestAnimationFrame(animate);
};

animate();
