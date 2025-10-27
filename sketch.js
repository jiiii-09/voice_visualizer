let mic;
let fft;
let vol = 0;
let smoothVol = 0;
let trails = []; // 🔥 잔상 저장 배열

function setup() {
  createCanvas(800, 480);
  background('#FAF3E0');

  mic = new p5.AudioIn();
  mic.start(() => { 
    fft = new p5.FFT();
    fft.setInput(mic);
  });
}

function draw() {
  background('#FAF3E0');

  if (mic.enabled) { // 마이크 접근 확인
    vol = mic.getLevel();
    smoothVol = lerp(smoothVol, vol, 0.2);

    let baseRadius = height * 0.17;
    let radius = baseRadius + smoothVol * 400;

    let c = lerpColor(
      color('#D7E9F7'),
      color('#E63946'),
      constrain((radius - baseRadius) / baseRadius, 0, 1)
    );

    let shapePoints = [];
    let noiseLevel = smoothVol * 600;
    for (let angle = 0; angle < TWO_PI; angle += 0.05) {
      let xoff = cos(angle) * 2 + frameCount * 0.01;
      let yoff = sin(angle) * 2 + frameCount * 0.01;
      let r = radius + (noise(xoff, yoff) - 0.5) * noiseLevel;
      let x = r * cos(angle);
      let y = r * sin(angle);
      shapePoints.push({ x, y });
    }

    trails.push({ points: shapePoints, col: c, alpha: 200 });
    if (trails.length > 15) trails.shift();

    push();
    translate(width / 2, height / 2);
    for (let i = 0; i < trails.length; i++) {
      let t = trails[i];
      fill(red(t.col), green(t.col), blue(t.col), t.alpha);
      noStroke();
      beginShape();
      for (let p of t.points) vertex(p.x * (1 + i * 0.05), p.y * (1 + i * 0.05));
      endShape(CLOSE);
      t.alpha *= 0.9;
    }
    pop();
  }
}

function windowResized() {
  resizeCanvas(800, 480);
}
