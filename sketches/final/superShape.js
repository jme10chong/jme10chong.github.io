const s0 = function(p) {
  p.fft_high;
  p.fft_mid;
  p.fft_low;
  p.high;
  p.mid;
  p.low;

  p.doneLoading;

  p.preload = function() {
    p.high = p.loadSound('website/assets/audio/high.mp3');
    p.mid = p.loadSound('website/assets/audio/mid.mp3');
    p.low = p.loadSound('website/assets/audio/low.mp3');

    p.high.playMode('restart');
    p.mid.playMode('restart');
    p.low.playMode('restart');
  };

  p.setup = function() {
    p.high.loop(0,1,0,0,0);
    p.mid.loop(0,1,0,0,0);
    p.low.loop(0,1,0,0,0);

    let smoothing = 0.8;
    let bins = 256;

    p.fft_high = new p5.FFT(smoothing, bins);
    p.fft_high.setInput(p.high);
    p.fft_mid = new p5.FFT(smoothing, bins);
    p.fft_mid.setInput(p.mid);
    p.fft_low = new p5.FFT(smoothing, bins);
    p.fft_low.setInput(p.low);

    p.doneLoading = true;
  }

  p.draw = function() {
    p.fft_low.analyze();
    p.fft_mid.analyze();
    p.fft_high.analyze();
  }
};

sound = new p5(s0, 'sound');

const s1 = function(p) {

  // variables from the super shape formula
  let n1 = 1;
  let n2 = 1;
  let n3 = 1;
  let m = 0;
  let a = 1;
  let b = 1;
  let x = 0;

	p.setup = function() {
    p.createCanvas(p.displayWidth,p.displayHeight);

    let gui = p.createGui('AUDIO MIXER', 10, 265);
    let volMin = 0;
    let volMax = 1;
    let volInitial = 0;
    let volStep = 0.1;
    let rateMin = 0.5;
    let rateMax = 5;
    let rateInitial = 1;
    let rateStep = 0.1;

    // calling for the "prototype.addRange" function from quicksettings.js to create sliders
    // parameters:(title, min, max, value, step, callback)

    gui.prototype.addRange('Treble - Volume', volMin, volMax, volInitial, volStep, function(val) {
        sound.high.setVolume(val);
    });
    gui.prototype.addRange('Treble - Speed', rateMin, rateMax, rateInitial, rateStep, function(val) {
        sound.high.rate(val);
    });
    gui.prototype.addRange('Mid - Volume', volMin, volMax, volInitial, volStep, function(val) {
        sound.mid.setVolume(val);
    });
    gui.prototype.addRange('Mid - Speed', rateMin, rateMax, rateInitial, rateStep, function(val) {
        sound.mid.rate(val);
    });
    gui.prototype.addRange('Bass - Volume', volMin, volMax, volInitial, volStep, function(val) {
        sound.low.setVolume(val);
    });
    gui.prototype.addRange('Bass - Speed', rateMin, rateMax, rateInitial, rateStep, function(val) {
        sound.low.rate(val);
    });
  }

	p.draw = function() {
    if(sound.doneLoading !== true) {
      p.fill(255,0,0);
      p.text("Loading ...", 100, 100);
      return;
    }

    let bass = sound.fft_low.getEnergy("bass"); // relatively constant value
    let mid = sound.fft_mid.getEnergy("mid")*2; // very dynamic value
    let treble = sound.fft_high.getEnergy("treble")*5; // slightly dynamic value

    p.background(0);
    p.stroke(255);
    console.log(x);

    n1 = 1 + treble;
    n2 = 1 + mid;
    n3 = 1 + bass;
    m = mid;



    superShape(m, -30+p.displayWidth/2, -90+p.displayHeight/2, 270, x);
  }

  p.mousePressed = function() {
    x+=1;
    if(x>2){
      x=0;
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
        case 0: p.vertex(x,y); p.vertex(-x,-y);break; // clockwise
        case 1: p.vertex(x,y); p.vertex(-x,-y); p.vertex(-x,y);p.vertex(x,-y); break; // ALL
        case 2: p.vertex(x,y); p.vertex(-x,y); p.vertex(-x,-y); p.vertex(x,-y); break; // upwards

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

p1 = new p5(s1, 'superShape');
