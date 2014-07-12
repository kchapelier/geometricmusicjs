"use strict";

var App = App || {};

var ac = Aural.Utils.Support.getAudioContext();
var bb;

window.addEventListener('load', function() {
	console.log('"I\'m loaded now" says', window, '.');
	console.log(ac, 'is an AudioContext.');
	console.log(document.body, 'is empty.');

	bb = new App.BufferBank();
	bb.loadSamples({
		'test1' : 'samples/test.wav',
		'test2' : 'samples/test2.wav'
	}, function() {
		console.log(bb);
	});
});