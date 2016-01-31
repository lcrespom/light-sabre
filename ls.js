$(function() {
	var ac = setupWA();
	var buf_ls_on, buf_ls_off, buf_ls_swing, buf_ls_hum;
	var humNode;

	$('#ls_on').click(function() {
		playBuffer(buf_ls_on);
		humNode = playBuffer(buf_ls_hum, true, 1);
	});
	$('#ls_off').click(function() {
		playBuffer(buf_ls_off);
		if (humNode) humNode.stop(ac.currentTime + 1);
	});

	setupAccelerometer(function() {
		playBuffer(buf_ls_swing);
	});

	function playBuffer(buf, loop, when) {
		if (!buf) return;
		var bufSrc = ac.createBufferSource();
		bufSrc.buffer = buf;
		if (loop) {
			bufSrc.loop = true;
			bufSrc.loopStart = 0;
			bufSrc.loopEnd = 9999999;
		}
		bufSrc.connect(ac.destination);
		if (!when) when = 0;
		bufSrc.start(ac.currentTime + when);
		return bufSrc;
	}

	function setupWA() {
		var ac;
		if (window.AudioContext) ac = new window.AudioContext();
		else ac = new window.webkitAudioContext();
		loadBuffer(ac, 'audio/saber-opening-short.wav', function(buffer) { buf_ls_on = buffer });
		loadBuffer(ac, 'audio/close.m4a', function(buffer) { buf_ls_off = buffer });
		loadBuffer(ac, 'audio/Light Saber Sounds-2-a.wav', function(buffer) { buf_ls_swing = buffer });
		loadBuffer(ac, 'audio/humm.mp3', function(buffer) { buf_ls_hum = buffer });
		return ac;
	}

	function loadBuffer(ac, url, cb) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function() {
			ac.decodeAudioData(xhr.response, function(buffer) {
				cb(buffer);
			});
		};
		xhr.send();
	}

	var oldX = 0, oldY = 0, oldZ = 0, varX, varY, varZ;
	// every unit on X and Y axis is equivalent to 2º of movement
	var variation = 10;

	var tilt = function(cb, x, y, z) {
		varX = Math.abs(x - oldX);
		varY = Math.abs(y - oldY);
		varZ = Math.abs(z - oldZ);
		if(varZ > variation || varX > variation || varY > variation) {
			oldX = x; oldY = y; oldZ = z;
			cb();
		}
	};

	function setupAccelerometer(cb) {
		if (window.DeviceOrientationEvent) {
			window.addEventListener("deviceorientation", function () {
				tilt(cb, event.beta, event.gamma, event.alpha);
			}, true);
		} else if (window.DeviceMotionEvent) {
			window.addEventListener('devicemotion', function () {
				tilt(cb, event.acceleration.x * 2, event.acceleration.y * 2, event.acceleration.z * 2);
			}, true);
		} else {
			window.addEventListener("MozOrientation", function () {
				tilt(cb, orientation.x * 50, orientation.y * 50, orientation.z * 50);
			}, true);
		}
	}

});