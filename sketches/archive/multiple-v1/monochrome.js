// monochrome background

const s2 = function(p) {

  let n1 = 1;
  let n2 = 1;
  let n3 = 1;
  let m = 0;
  let a = 1;
  let b = 1;

	p.setup = function() {
    p.createCanvas(p.displayWidth, 540);
  }

	p.draw = function() {
    // getEnergy() returns a value between 0 and 255;
    if(sound.doneLoading !== true) {
      p.fill(255,0,0);
      p.text("Loading ...", 100, 100);
      return;
    }

    let amp = sound.amp.getLevel()*255*2;
    console.log(amp);
    p.background(amp); // monochrome
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

p2 = new p5(s2, 'monochrome');
