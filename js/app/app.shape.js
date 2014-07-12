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

		this.pan = 0;
		this.gain = 1;
		this.currentSegmentPosition = 0;
		this.currentSegment = 0;

		this.setSegmentsNumber(segmentsNumber);
		this.setSize(size);
	};

	Shape.prototype.gain = null;
	Shape.prototype.pan = null;
	Shape.prototype.size = null;
	Shape.prototype.segmentsNumber = null;
	Shape.prototype.segmentsReaders = null;
	Shape.prototype.audioBuffer = null;

	Shape.prototype.currentSegment = null;
	Shape.prototype.currentSegmentPosition = null;

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

	Shape.prototype.getNextSample = function(channel, samplesPerMeasure) {
		var sampleValue = 0;

		if(this.audioBuffer.length > this.currentSegmentPosition) {
			sampleValue = this.audioBuffer.getSample(this.currentSegmentPosition, channel) * this.gain;
		}

		this.currentSegmentPosition++;

		var samplesPerSegment = samplesPerMeasure * Math.pow(2, this.size) / this.segmentsNumber;

		if(this.currentSegmentPosition > samplesPerSegment) {
			this.currentSegmentPosition = this.currentSegmentPosition % samplesPerSegment;

			this.currentSegment = (this.currentSegment + 1) % this.segmentsNumber;
		}

		return sampleValue;
	};

	App.Shape = Shape;
})(App || {});