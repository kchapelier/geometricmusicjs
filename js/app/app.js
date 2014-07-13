"use strict";

//TODO move all the dom structure to the javascript, for bragging rights
//TODO see if it is possible to remove the lodash dependency
//TODO make a grunt script to uglify vendors/ and app/ separately
//TODO include javascript at the end of the body

var App = App || {};

var ae,
	bb,
	sm,
	main;

window.addEventListener('load', function() {
	ae = new App.AudioEngine();

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

		main = new App.UI.Main(ae, bb, sm);
	});
});