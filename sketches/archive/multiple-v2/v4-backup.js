// v2: updated sketch after Andy's input
// v3: background manipulation
// v4: movement of shapes

const s2 = function(p) {

  let n1 = 1;
  let n2 = 1;
  let n3 = 1;
  let m = 0;
  let a = 1;
  let b = 1;

  p.setup = function() {
    p.createCanvas(960,540);
  }

	p.draw = function() {
    if(sound.doneLoading !== true) {
      p.fill(255,0,0);
      p.text("Loading ...", 100, 100);
      return;
    }
    // getEnergy() returns a value between 0 and 255;
    let bass = sound.fft_low.getEnergy("bass"); // relatively constant value
    let lowMid = sound.fft_low_mid.getEnergy("lowMid")*1.5; // slightly dynamic value
    let mid = sound.fft_mid.getEnergy("mid")*2; // very dynamic value
    let highMid = sound.fft_high_mid.getEnergy("highMid")*2; // very dynamic value
    let treble = sound.fft_high.getEnergy("treble")*5; // slightly dynamic value

    m = highMid;
    console.log(m);
    m += (m - m/2) * 1;
    p.background(200,75,20);

    // BEYBLADE!!!
    for(let i = 4; i <=8; i++) {
      superShape(m, lowMid, mid, 150, i);
      superShape(m, p.width-bass, p.height-treble, 150, i);
      superShape(m, p.width-mid, lowMid, 150, i);
      superShape(m, treble, p.height-bass, 150, i);
    }
  }

  superShape = function(m, a, b, size, choose) {
    p.push();
    p.translate(a, b);
    p.stroke(255);
    p.noFill();
    p.beginShape();

    let total = 30;
    let increment = p.TWO_PI / total;

    for(let angle = 0; angle < p.TWO_PI; angle+=increment) {
      let r = math(angle);
      let x = size * r * p.sin(angle);
      let y = size * r * p.cos(angle);

      switch(choose) {
        case 0: p.vertex(x,y); break; // bottom clockwise
        case 1: p.vertex(-x,-y); break; // top clockwise
        case 2: p.vertex(-x,y); break; // bottom anti-clockwise
        case 3: p.vertex(x,-y); break; // top anti-clockwise

        case 4: p.vertex(x,y); p.vertex(-x,y); break; // upwards
        case 5: p.vertex(-x,-y); p.vertex(x,-y); break; // downwards

        case 6: p.vertex(x,y); p.vertex(-x,-y); break; // clockwise
        case 7: p.vertex(-x,y); p.vertex(x,-y); break; // anti-clockwise

        case 8: p.vertex(x,y); p.vertex(-x,-y); p.vertex(-x,y); p.vertex(x,-y); break; // ALL
      }

    }
    p.endShape(p.CLOSE);
    p.pop();
  }

	p.keyPressed = function() {
    sound.high.stop();
    sound.high_mid.stop();
    sound.mid.stop();
    sound.low_mid.stop();
    sound.low.stop();
  }

	p.keyReleased = function() {
    sound.high.play();
    sound.high_mid.play();
    sound.mid.play();
    sound.low_mid.play();
    sound.low.play();
  }

	math = function(theta) {
    let r = 1;
    let part1 = (1/a) * p.cos(theta * m/4);
    part1 = p.abs(part1);
    part1 = p.pow(part1, n2);
    let part2 = (1/b) * p.sin(theta * m/4);
    part2 = p.abs(part2);
    part2 = p.pow(part2, n3);
    let part3 = p.pow(part1 + part2, 1 / n1);
    if(part3 === 0) {
      return 0;
    }
    return (1/part3);
  }
}

p2 = new p5(s2, 'v4');
