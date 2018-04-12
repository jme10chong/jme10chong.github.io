// points

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
    p.high = p.loadSound('assets/audio/high.mp3');
    p.high_mid = p.loadSound('assets/audio/high_mid.mp3');
    p.mid = p.loadSound('assets/audio/mid.mp3');
    p.low_mid = p.loadSound('assets/audio/low_mid.mp3');
    p.low = p.loadSound('assets/audio/low.mp3');

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
    p.createCanvas(p.displayWidth, 540);

    let gui = p.createGui('AUDIO MIXER', p.displayWidth-285, 210);
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
    let amp = sound.amp.getLevel()*255*2;

    p.background(amp); // monochrome


    // crazy background
    for(let x = 1; x <= 50; x++) {
      for(let y = 1; y <= 50; y++) {
        p.stroke(p.random(255));
        xPoint = x*treble;
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
    for(let x = 0; x < 120; x++) {
      for(let y = 0; y < 60; y++) {
        p.stroke(255);
        p.point(x*60*255/bass, y*40);
        p.point(p.width-x*60*255/bass, y*40);
      }
    }
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
}

p1 = new p5(s1, 'points');
