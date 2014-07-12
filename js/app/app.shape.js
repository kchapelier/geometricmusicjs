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

		this.setTuning(-5);

		this.pan = 0;
		this.gain = 1;
		this.currentSegmentPosition = 0;
		this.currentSegment = 0;

		this.setSegmentsNumber(segmentsNumber);
		this.setSize(size);
	};

	Shape.prototype.gain = null; //volume (0 : silent, 1 : loud)
	Shape.prototype.pan = null; //pan (-1 : hard left, 0 : center, 1 : hard right)
	Shape.prototype.size = null; // number of measures
	Shape.prototype.tuning = null; // tuning in semitones (negative : lower pitch, positive : higher pitch)
	Shape.prototype.speed = null; // sample reading speed, calculated from the tuning

	Shape.prototype.segmentsNumber = null;
	Shape.prototype.segmentsReaders = null;
	Shape.prototype.audioBuffer = null;

	Shape.prototype.currentSegment = null;
	Shape.prototype.currentSegmentPosition = null;

	Shape.prototype.setSize = function(size) {
		this.size = size;

		return this;
	};

	Shape.prototype.setTuning = function(semitones) {
		this.tuning = semitones;
		this.speed = 1 * (Math.pow(2, semitones / 12));

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

		if(this.audioBuffer.length > this.currentSegmentPosition * this.speed) {
			sampleValue = this.audioBuffer.getSample(this.currentSegmentPosition * this.speed, channel) * this.gain;
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