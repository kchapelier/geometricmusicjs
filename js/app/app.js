"use strict";

var App = App || {};

var ae,
	bb,
	sm;

window.addEventListener('load', function() {
	ae = new App.AudioEngine();

	console.log('"I\'m ready now" says', ae, '.');

	bb = new App.BufferBank();
	bb.loadSamples({
		'test1' : 'samples/test.wav',
		'test2' : 'samples/test2.wav'
	}, function() {
		sm = new App.ShapeManager(bb);
		ae.setShapeCollection(sm.getCollection());
		ae.playing = true;
	});
});