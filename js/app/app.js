"use strict";

var App = App || {};

var ac = Aural.Utils.Support.getAudioContext();

window.addEventListener('load', function() {
	console.log('"I\'m loaded now" says', window, '.');
	console.log(ac, 'is an AudioContext.');
	console.log(document.body, 'is empty.');
});