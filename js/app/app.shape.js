(function(App) {
	"use strict";

	var arrayResize = function(array, size, filler) {
		var delta = size - array.length;
		if(delta > 0) {
			for(var i = 0; i < delta; i++) {
				array.push(filler); //pad with filler
			}
		} else {
			array.splice(size, -delta); //remove {delta} excedentary elements
		}
	};

	var Shape = function(size, segmentsNumber, audioBuffer) {
		this.segmentsReaders = [];
		this.audioBuffer = audioBuffer;

		this.setTuning(0);

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
		arrayResize(this.segmentsReaders, this.segmentsNumber, App.Readers['default']);

		return this;
	};

	Shape.prototype.setSegmentReader = function(index, reader) {
		reader = typeof reader === 'function' ? reader : App.Readers.silent;
		index = Math.max(0, Math.min(index, this.segmentsNumber - 1));
		this.segmentsReaders[index] = reader;

		return this;
	};

	Shape.prototype.getNextSamples = function(samplesPerMeasure) {
		//TODO do this out of the audio loop
		var samplesPerSegment = samplesPerMeasure * Math.pow(2, this.size) / this.segmentsNumber;

		var reader = this.segmentsReaders[this.currentSegment];

		var sampleValue = [0,0];

		if(reader) {
			sampleValue[0] = reader(
				this.audioBuffer,
				0,
				this.currentSegmentPosition,
				this.speed,
				samplesPerSegment
			) * this.gain;

			sampleValue[1] = reader(
				this.audioBuffer,
				1,
				this.currentSegmentPosition,
				this.speed,
				samplesPerSegment
			) * this.gain;
		}

		this.currentSegmentPosition++;

		if(this.currentSegmentPosition > samplesPerSegment) {
			this.currentSegmentPosition = this.currentSegmentPosition % samplesPerSegment;

			this.currentSegment = (this.currentSegment + 1) % this.segmentsNumber;
		}

		return sampleValue;
	};

	App.Shape = Shape;
})(App || {});