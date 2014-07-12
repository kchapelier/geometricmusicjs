"use strict";

var App = App || {};

var bb,
	sm;

window.addEventListener('load', function() {
	console.log('"I\'m loaded now" says', window, '.');

	bb = new App.BufferBank();
	bb.loadSamples({
		'test1' : 'samples/test.wav',
		'test2' : 'samples/test2.wav'
	}, function() {
		sm = new App.ShapeManager(bb);
		console.log(bb, sm);
	});
});