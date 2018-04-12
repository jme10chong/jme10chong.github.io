// v2: updated sketch after Andy's input
// v3: background manipulation
let sound;

const s0 = function(p) {
  p.fft_high;
  p.fft_high_mid;
  p.fft_mid;
  p.fft_low_mid;
  p.fft_low;
  p.high;
  p.high_mid;
  p.mid;
  p.low_mid;
  p.low;
  p.amp;

  p.doneLoading;

  p.preload = function() {
    p.high = p.loadSound('website/assets/audio/high.mp3');
    p.high_mid = p.loadSound('website/assets/audio/high_mid.mp3');
    p.mid = p.loadSound('website/assets/audio/mid.mp3');
    p.low_mid = p.loadSound('website/assets/audio/low_mid.mp3');
    p.low = p.loadSound('website/assets/audio/low.mp3');

    p.high.playMode('restart');
    p.high_mid.playMode('restart');
    p.mid.playMode('restart');
    p.low_mid.playMode('restart');
    p.low.playMode('restart');
  };

  p.setup = function() {
    p.high.loop(0,1,0,0,0);
    p.high_mid.loop(0,1,0,0,0);
    p.mid.loop(0,1,0,0,0);
    p.low_mid.loop(0,1,0,0,0);
    p.low.loop(0,1,0,0,0);

    let smoothing = 0.8;
    let bins = 256;

    p.fft_high = new p5.FFT(smoothing, bins);
    p.fft_high.setInput(p.high);
    p.fft_high_mid = new p5.FFT(smoothing, bins);
    p.fft_high_mid.setInput(p.high_mid);
    p.fft_mid = new p5.FFT(smoothing, bins);
    p.fft_mid.setInput(p.mid);
    p.fft_low_mid = new p5.FFT(smoothing, bins);
    p.fft_low_mid.setInput(p.low_mid);
    p.fft_low = new p5.FFT(smoothing, bins);
    p.fft_low.setInput(p.low);
    p.amp = new p5.Amplitude();
    p.amp.setInput();

    p.doneLoading = true;
  }

  p.draw = function() {
    p.fft_low.analyze();
    p.fft_low_mid.analyze();
    p.fft_mid.analyze();
    p.fft_high_mid.analyze();
    p.fft_high.analyze();
  }
};

sound = new p5(s0, 'sound');

let p1, p2, p3;

const s1 = function(p) {

  let n1 = 1;
  let n2 = 1;
  let n3 = 1;
  let m = 0;
  let a = 1;
  let b = 1;

	p.setup = function() {
    p.createCanvas(960,540);

    let gui = p.createGui('AUDIO MIXER', p.displayWidth-300, 265);
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
    gui.prototype.addRange('HighMid - Volume', volMin, volMax, volInitial, volStep, function(val) {
        sound.high_mid.setVolume(val);
    });
    gui.prototype.addRange('HighMid - Speed', rateMin, rateMax, rateInitial, rateStep, function(val) {
        sound.high_mid.rate(val);
    });
    gui.prototype.addRange('Mid - Volume', volMin, volMax, volInitial, volStep, function(val) {
        sound.mid.setVolume(val);
    });
    gui.prototype.addRange('Mid - Speed', rateMin, rateMax, rateInitial, rateStep, function(val) {
        sound.mid.rate(val);
    });
    gui.prototype.addRange('LowMid - Volume', volMin, volMax, volInitial, volStep, function(val) {
        sound.low_mid.setVolume(val);
    });
    gui.prototype.addRange('LowMid - Speed', rateMin, rateMax, rateInitial, rateStep, function(val) {
        sound.low_mid.rate(val);
    });
    gui.prototype.addRange('Bass - Volume', volMin, volMax, volInitial, volStep, function(val) {
        sound.low.setVolume(val);
    });
    gui.prototype.addRange('Bass - Speed', rateMin, rateMax, rateInitial, rateStep, function(val) {
        sound.low.rate(val);
    });
  }

	p.draw = function() {
    // getEnergy() returns a value between 0 and 255;
    if(sound.doneLoading !== true) {
      p.fill(255,0,0);
      p.text("Loading ...", 100, 100);
      return;
    }

      let bass = sound.fft_low.getEnergy("bass"); // relatively constant value
      let lowMid = sound.fft_low_mid.getEnergy("lowMid")*1.5; // slightly dynamic value
      let mid = sound.fft_mid.getEnergy("mid")*2; // very dynamic value
      let highMid = sound.fft_high_mid.getEnergy("highMid")*2; // very dynamic value
      let treble = sound.fft_high.getEnergy("treble")*5; // slightly dynamic value

    // let midNew = mid;
    // midNew -= (midNew - 10) * 0.005; // smoothing
    // mid += midNew;
    m = mid;

    p.background(bass/4,lowMid/4,mid/4); // colored
    // background(mid/4); // monochrome

    // crazy background
    for(let x = 1; x <= 25; x++) {
      for(let y = 1; y <= 25; y++) {
        p.stroke(255);
        xPoint = x*mid;
        yPoint = y*mid;
        if(xPoint > p.width) {
          xPoint = p.width;
        }
        if(yPoint > p.height) {
          yPoint = p.height;
        }
        if(xPoint < p.width/2) {
          xPoint = p.width/2;
        }
        if(yPoint < p.height/2) {
          yPoint = p.height/2;
        }
        if(xPoint != p.width/2) { // only draw if volume is engaged
          p.point(xPoint, yPoint);
          p.point(xPoint, p.height-yPoint);
          p.point(p.width-xPoint, yPoint);
          p.point(p.width-xPoint, p.height-yPoint);
        }
      }
    }

    // static background
    for(let x = 0; x < 30; x++) {
      for(let y = 0; y < 15; y++) {
        p.stroke(255);
        p.point(x*60*255/bass, y*40);
        p.point(p.width-x*60*255/bass, y*40);
      }
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

p1 = new p5(s1, 'v3');
