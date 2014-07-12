(function(App) {
	"use strict";

	var arrayResize = function(array, size) {
		var delta = size - array.length;
		if(delta > 0) {
			array.length = size; //force the size of the array
		} else {
			array.splice(size, -delta); //remove {delta} excedentary elements
		}
	};

	var Shape = function(size, segmentsNumber, audioBuffer) {
		this.segmentsReaders = [];
		this.audioBuffer = audioBuffer;

		this.setSegmentsNumber(segmentsNumber);
		this.setSize(size);
	};

	Shape.prototype.size = null;
	Shape.prototype.segmentsNumber = null;
	Shape.prototype.segmentsReaders = null;
	Shape.prototype.audioBuffer = null;

	Shape.prototype.setSize = function(size) {
		this.size = size;

		return this;
	};

	Shape.prototype.setSegmentsNumber = function(number) {
		this.segmentsNumber = Math.max(1, number);
		arrayResize(this.segmentsReaders, this.segmentsNumber);

		return this;
	};

	Shape.prototype.setSegmentReader = function(index, reader) {
		index = Math.max(0, Math.min(index, this.segmentsNumber - 1));
		this.segmentsReaders[index] = reader;

		return this;
	};

	App.Shape = Shape;
})(App || {});