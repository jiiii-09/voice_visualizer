let mic;
let fft;
let vol = 0;
let smoothVol = 0;

let trails = []; // 🔥 잔상 저장 배열

function setup() {
  createCanvas(800, 480); // 7인치 해상도 맞춤
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

    // 화면 높이를 기준으로 원 크기 계산 (정원 유지)
    let baseRadius = height * 0.17; // 기본 원 크기
    let radius = baseRadius + smoothVol * 400; // 볼륨 반응

    // 컬러 (감정 고조 표현)
    let c = lerpColor(
      color('#D7E9F7'),
      color('#E63946'),
      constrain((radius - baseRadius) / baseRadius, 0, 1)
    );

    // --- 현재 원의 모양을 trail로 저장 ---
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

    // trail 개수 제한
    if (trails.length > 15) {
      trails.shift();
    }

    // --- 잔상 그리기 ---
    push();
    translate(width / 2, height / 2); // 화면 중앙
    for (let i = 0; i < trails.length; i++) {
      let t = trails[i];
      fill(red(t.col), green(t.col), blue(t.col), t.alpha);
      noStroke();
      beginShape();
      for (let p of t.points) {
        vertex(p.x * (1 + i * 0.05), p.y * (1 + i * 0.05));
      }
      endShape(CLOSE);

      // 잔상 투명도 점차 감소
      t.alpha *= 0.9;
    }
    pop();
  }
}

function windowResized() {
  resizeCanvas(800, 480); // 고정 해상도 유지
}
