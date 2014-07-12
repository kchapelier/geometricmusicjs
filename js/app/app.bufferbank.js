(function(App) {
	"use strict";

	var BufferBank = function() {
		this.collection = {};
	};

	BufferBank.prototype.collection = null;

	BufferBank.prototype.loadSamples = function(samples, callback) {
		var args = [];

		_.forOwn(samples, function(url, id) {
			args.push({
				'id' : id,
				'url' : url,
				'type' : 'buffer'
			});
		});

		Aural.Utils.XHR.parallelLoad(
			args,
			function(buffer) {
				buffer.makeStereo();
			},
			function(buffers) {
				_.forEach(buffers, function(buffer) {
					this.collection[buffer.id] = buffer.data;
				}.bind(this));

				if(typeof callback === 'function') {
					callback(this);
				}
			}.bind(this)
		);

		return this;
	};

	BufferBank.prototype.getBufferCollection = function() {
		return this.collection;
	};

	BufferBank.prototype.getBuffer = function(id) {
		return this.collection[id] || null;
	};

	App.BufferBank = BufferBank;
})(App || {});