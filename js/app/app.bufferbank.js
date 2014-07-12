(function(App) {
	"use strict";

	var BufferBank = null;

	Aural.Utils.XHR.parallelLoad(
		[
			{ url : './samples/test.wav', 'type' : 'buffer', 'id' : 'test' },
			{ url : './samples/test2.wav', 'type' : 'buffer', 'id' : 'test2' },
		],
		null,
		function(buffers) {
			console.log(buffers);
		}.bind(this)
	);

	App.BufferBank = BufferBank;
})(App || {});