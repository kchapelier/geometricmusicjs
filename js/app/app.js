"use strict";

var App = App || {};

var ae,
	bb,
	sm;

window.addEventListener('load', function() {
	ae = new App.AudioEngine();

	var start

	console.log('"I\'m ready now" says', ae, '.');

	bb = new App.BufferBank();
	bb.loadSamples({
		'8bit01' : 'samples/8bit01.wav',
		'chroma01' : 'samples/chroma01.wav',
		'chroma02' : 'samples/chroma02.wav',
		'chroma03' : 'samples/chroma03.wav',
		'piano01' : 'samples/piano01.wav'
	}, function() {
		sm = new App.ShapeManager(bb);
		ae.setShapeCollection(sm.getCollection());

		new App.UI.Main(ae, bb, sm);
	});
});