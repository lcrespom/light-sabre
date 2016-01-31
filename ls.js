$(function() {
	var ac = setupWA();
	var buf_ls_on, buf_ls_off, buf_ls_swing, buf_ls_hum;

	$('#ls_on').click(_ => {
		playBuffer(buf_ls_on);
	});
	$('#ls_off').click(_ => {
		playBuffer(buf_ls_off);
	});
	$('#ls_swing').click(_ => {
		playBuffer(buf_ls_swing);
	});
	$('#ls_hum').click(_ => {
		playBuffer(buf_ls_hum, true);
	});

	function playBuffer(buf, loop) {
		if (!buf) return;
		var bufSrc = ac.createBufferSource();
		bufSrc.buffer = buf;
		if (loop) {
			bufSrc.loop = true;
			bufSrc.loopStart = 0;
			bufSrc.loopEnd = 9999999;
		}
		bufSrc.connect(ac.destination);
		bufSrc.start();
	}

	function setupWA() {
		var ac = new AudioContext();
		loadBuffer(ac, 'audio/saber-opening-short.wav', buffer => buf_ls_on = buffer);
		loadBuffer(ac, 'audio/close.m4a', buffer => buf_ls_off = buffer);
		loadBuffer(ac, 'audio/Light Saber Sounds-2-a.wav', buffer => buf_ls_swing = buffer);
		loadBuffer(ac, 'audio/humm.mp3', buffer => buf_ls_hum = buffer);
		return ac;
	}

	function loadBuffer(ac, url, cb) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = _ => {
			ac.decodeAudioData(xhr.response, buffer => {
				cb(buffer);
			});
		};
		xhr.send();
	}

});