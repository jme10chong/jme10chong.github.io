// gif creation code courtesy of Andy
// sketch code is identical to "superShape.js"

const s1 = function(p) {

let gif;
let animation;
let isRecording;
let context;
let n1 = 1;
let n2 = 1;
let n3 = 1;
let m = 0;
let a = 1;
let b = 1;
let x = 0;
let fft_high;
let fft_mid;
let fft_low;
let high;
let mid;
let low;


	p.preload = function() {
		high = p.loadSound('website/assets/audio/high.mp3');
		high_mid = p.loadSound('website/assets/audio/high_mid.mp3');
		mid = p.loadSound('website/assets/audio/mid.mp3');
		low_mid = p.loadSound('website/assets/audio/low_mid.mp3');
		low = p.loadSound('website/assets/audio/low.mp3');

		high.playMode('restart');
		high_mid.playMode('restart');
		mid.playMode('restart');
		low_mid.playMode('restart');
		low.playMode('restart');
	}

	p.setup = function() {
		context = p.createCanvas(540,540);
		animation = [{x:0, y:0}];
		initGif();

		let gui = p.createGui('ИДП', p.displayWidth-250, 200);
		let volMin = 0;
		let volMax = 1;
		let volInitial = 0;
		let volStep = 0.1;
		let rateMin = 0.5;
		let rateMax = 5;
		let rateInitial = 1;
		let rateStep = 0.1;

		high.loop(0,1,0,0,0);
    high_mid.loop(0,1,0,0,0);
    mid.loop(0,1,0,0,0);
    low_mid.loop(0,1,0,0,0);
    low.loop(0,1,0,0,0);

    let smoothing = 0.8;
    let bins = 256;

    fft_high = new p5.FFT(smoothing, bins);
    fft_high.setInput(high);
    fft_high_mid = new p5.FFT(smoothing, bins);
    fft_high_mid.setInput(high_mid);
    fft_mid = new p5.FFT(smoothing, bins);
    fft_mid.setInput(mid);
    fft_low_mid = new p5.FFT(smoothing, bins);
    fft_low_mid.setInput(low_mid);
    fft_low = new p5.FFT(smoothing, bins);
    fft_low.setInput(low);
    amp = new p5.Amplitude();
    amp.setInput();

		gui.prototype.addRange('Treble - Volume', volMin, volMax, volInitial, volStep, function(val) {
        high.setVolume(val);
    });
    gui.prototype.addRange('Treble - Speed', rateMin, rateMax, rateInitial, rateStep, function(val) {
        high.rate(val);
    });
    gui.prototype.addRange('Mid - Volume', volMin, volMax, volInitial, volStep, function(val) {
        mid.setVolume(val);
    });
    gui.prototype.addRange('Mid - Speed', rateMin, rateMax, rateInitial, rateStep, function(val) {
        mid.rate(val);
    });
    gui.prototype.addRange('Bass - Volume', volMin, volMax, volInitial, volStep, function(val) {
        low.setVolume(val);
    });
    gui.prototype.addRange('Bass - Speed', rateMin, rateMax, rateInitial, rateStep, function(val) {
        low.rate(val);
    });
	}

	p.draw = function() {
		fft_low.analyze();
    fft_low_mid.analyze();
    fft_mid.analyze();
    fft_high_mid.analyze();
    fft_high.analyze();

		let bass = fft_low.getEnergy("bass"); // relatively constant value
    let lowMid = fft_low_mid.getEnergy("lowMid")*1.5; // slightly dynamic value
    let mid = fft_mid.getEnergy("mid")*2; // very dynamic value
    let highMid = fft_high_mid.getEnergy("highMid")*2; // very dynamic value
    let treble = fft_high.getEnergy("treble")*5; // slightly dynamic value

		p.background(0);
		n1 = 1 + treble;
    n2 = 1 + mid;
    n3 = 1 + bass;
    m = mid;


		p.stroke(200);
    superShape(m, p.width/2, 30+p.height/2, 180, x);

		if(isRecording) {
			if(p.frameCount%4 == 0) gif.addFrame(context.elt, {delay: 1, copy: true});
			p.fill(255,0,0);
			p.noStroke();
			p.ellipse(20,60,20,20);
			console.log('recording ...');
		}
	}

	superShape = function(m, a, b, size, choose) {
    p.push();
    p.translate(a, b);
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

	p.mousePressed = function() {
    x+=1;
    if(x>2){
      x=0;
    }
  }

	p.keyPressed = function() {
		console.log('key-pressed', p.key);
		if(p.key === 'R') isRecording = !isRecording;
		if(p.key === 'S') gif.render();
	}

	function initGif() {
		gif = new GIF({
			workerScript: 'libraries/gif.worker.js',
	    workers: 2,
	    quality: 40
	  });

	  gif.on('finished', function(blob) {
			console.log('done');
	    window.open(URL.createObjectURL(blob));
	    initGif();
	  });
	}
}

p1 = new p5(s1, 'DIY');
