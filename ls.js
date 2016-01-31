$(function() {
	var ac = setupWA();
	var buf_ls_on;

	$('#sound1').click(_ => {
		playBuffer(buf_ls_on);
	});

	function playBuffer(buf) {
		if (!buf) return;
		var bufSrc = ac.createBufferSource();
		bufSrc.buffer = buf;
		bufSrc.connect(ac.destination);
		bufSrc.start();
	}

	function setupWA() {
		var ac = new AudioContext();
		loadBuffer(ac, 'audio/saber-opening-short.wav', buffer => buf_ls_on = buffer);
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